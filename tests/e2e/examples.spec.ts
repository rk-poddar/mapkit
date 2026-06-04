import { expect, test, type Page } from "@playwright/test";

const examples = {
  leaflet: "http://127.0.0.1:3101",
  maplibre: "http://127.0.0.1:3102?style=offline",
  mapbox: "http://127.0.0.1:3103",
  googleMaps: "http://127.0.0.1:3104",
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
});
