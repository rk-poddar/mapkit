import { expect, test, type Page } from "@playwright/test";

const examples = {
  leaflet: "http://127.0.0.1:3101",
  maplibre: "http://127.0.0.1:3102?style=offline",
  mapbox: "http://127.0.0.1:3103",
  googleMaps: "http://127.0.0.1:3104",
  docs: "http://127.0.0.1:3105",
} as const;

async function blockMapTiles(page: Page) {
  await page.route(/(tile\.openstreetmap\.org|basemaps\.cartocdn\.com|api\.maptiler\.com)/, (route) =>
    route.abort(),
  );
}

test.describe("example runtime smoke checks", () => {
  test("Leaflet example renders a ready map with markers and controls", async ({ page }) => {
    await blockMapTiles(page);
    await page.goto(examples.leaflet);

    const map = page.locator('[data-mapkit-engine="leaflet"]');
    await expect(map).toBeVisible();
    await expect(map).toHaveAttribute("data-mapkit-ready", "true", { timeout: 15_000 });
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.locator(".mapkit-leaflet-marker")).toHaveCount(3);
    await expect(page.locator(".leaflet-interactive").first()).toBeVisible();

    await page.getByRole("button", { name: "Hide route" }).click();
    await expect(page.getByRole("button", { name: "Show route" })).toBeVisible();
  });

  test("MapLibre example renders a ready WebGL map with markers and controls", async ({ page }) => {
    await blockMapTiles(page);
    await page.goto(examples.maplibre);

    const map = page.locator('[data-mapkit-engine="maplibre"]');
    await expect(map).toBeVisible();
    await expect(map).toHaveAttribute("data-mapkit-ready", "true", { timeout: 20_000 });
    await expect(page.locator(".maplibregl-canvas")).toBeVisible();
    await expect(page.locator(".maplibregl-marker")).toHaveCount(3);

    await page.getByRole("button", { name: "Hide polygon" }).click();
    await expect(page.getByRole("button", { name: "Show polygon" })).toBeVisible();
  });

  test("Mapbox example shows a clear setup state when no token is configured", async ({ page }) => {
    await page.goto(examples.mapbox);

    await expect(page.getByRole("heading", { name: "Mapbox token required" })).toBeVisible();
    await expect(page.getByText("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token")).toBeVisible();
    await expect(page.locator('[data-mapkit-engine="mapbox"]')).toHaveCount(0);
  });

  test("Google Maps example shows a clear setup state when no API key is configured", async ({
    page,
  }) => {
    await page.goto(examples.googleMaps);

    await expect(page.getByRole("heading", { name: "Google Maps API key required" })).toBeVisible();
    await expect(page.getByText("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key")).toBeVisible();
    await expect(page.locator('[data-mapkit-engine="google-maps"]')).toHaveCount(0);
  });

  test("Docs app renders the product showcase grid", async ({ page }) => {
    await blockMapTiles(page);
    await page.goto(examples.docs);

    await expect(
      page.getByRole("heading", { name: "Beautiful maps, made simple" }),
    ).toBeVisible();
    await expect(page.getByText("Active Users")).toBeVisible();
    await expect(page.getByText("Central Park Loop")).toBeVisible();

    const maps = page.locator('[data-mapkit-engine="maplibre"]');
    await expect(maps.first()).toBeVisible();
    await expect(maps.first()).toHaveAttribute("data-mapkit-ready", "true", { timeout: 20_000 });
    await expect(maps).toHaveCount(6);
    await expect(page.locator(".maplibregl-marker").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Fly to destination" })).toBeVisible();
  });

  test("Docs component pages expose install commands and source previews", async ({ page }) => {
    await page.goto(`${examples.docs}/components`);

    await expect(page.getByRole("heading", { name: "Components" })).toBeVisible();
    await page.getByRole("link", { name: /^Map The root container/ }).click();

    await expect(page).toHaveURL(/\/components\/map$/);
    await expect(page.getByRole("heading", { name: "Map" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Controlled Mode" })).toBeVisible();

    await page.goto(`${examples.docs}/components`);
    await page.locator("a[href='/components/map-controls']").click();

    await expect(page).toHaveURL(/\/components\/map-controls$/);
    await expect(page.getByRole("heading", { name: "Map Controls" })).toBeVisible();
    await expect(page.getByText("pnpm dlx @map-kit/cli add map-controls")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Source" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy code" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "View Code" })).toBeVisible();
  });

  test("Docs installation and registry pages render guide content", async ({ page }) => {
    await page.goto(`${examples.docs}/docs/getting-started`);
    await expect(page.locator("h1", { hasText: "Introduction" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Any Map Engine" })).toBeVisible();

    await page.goto(`${examples.docs}/docs/installation`);
    await expect(page.locator("h1", { hasText: "Installation" })).toBeVisible();
    await expect(page.getByText("pnpm add @map-kit/react @map-kit/leaflet leaflet")).toBeVisible();

    await page.goto(`${examples.docs}/docs/api-reference`);
    await expect(page.getByRole("heading", { name: "API Reference" })).toBeVisible();
    await expect(page.getByText("Shared React primitives")).toBeVisible();

    await page.goto(`${examples.docs}/docs/registry`);
    await expect(page.getByRole("heading", { name: "Blocks Registry" })).toBeVisible();
    await expect(page.getByText("\"schemaVersion\": \"0.1.0\"")).toBeVisible();
  });

  test("Docs search jumps to component detail pages", async ({ page }) => {
    await page.goto(examples.docs);

    await page.getByRole("button", { name: /Search/ }).click();
    await page.getByRole("searchbox", { name: "Search docs" }).fill("legend");
    await page.getByRole("button", { name: "Search result: Map Legend" }).click();

    await expect(page).toHaveURL(/\/components\/map-legend$/);
    await expect(page.getByRole("heading", { name: "Map Legend" })).toBeVisible();
  });
});
