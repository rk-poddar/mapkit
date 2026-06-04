import { describe, expect, it } from "vitest";
import { mapLibreAdapter } from "./adapter";
import { maplibreCapabilities } from "./capabilities";
import { resolveMapLibreStyle } from "./provider";

const requiredCapabilityKeys = [
  "rasterTiles",
  "vectorTiles",
  "customStyleJson",
  "markers",
  "htmlMarkers",
  "popups",
  "routes",
  "circles",
  "polygons",
  "editableShapes",
  "clustering",
  "heatmap",
  "liveTracking",
  "routePlayback",
  "nativePlacesSearch",
  "nativeDirections",
] as const;

describe("@map-kit/maplibre", () => {
  it("exports a complete adapter contract", () => {
    expect(mapLibreAdapter.engine).toBe("maplibre");
    expect(mapLibreAdapter.capabilities).toBe(maplibreCapabilities);
    for (const method of [
      "createMap",
      "destroyMap",
      "setView",
      "fitBounds",
      "addMarker",
      "updateMarker",
      "removeMarker",
      "addRoute",
      "updateRoute",
      "removeRoute",
      "addCircle",
      "updateCircle",
      "removeCircle",
      "addPolygon",
      "updatePolygon",
      "removePolygon",
    ] as const) {
      expect(mapLibreAdapter[method]).toEqual(expect.any(Function));
    }
  });

  it("declares every capability flag", () => {
    expect(Object.keys(maplibreCapabilities).sort()).toEqual([...requiredCapabilityKeys].sort());
  });

  it("resolves raster and hosted style providers", () => {
    const osmStyle = resolveMapLibreStyle();
    const maptilerStyle = resolveMapLibreStyle({ provider: "maptiler", apiKey: "abc 123" });

    expect(typeof osmStyle).toBe("object");
    expect(maptilerStyle).toContain("abc%20123");
  });

  it("adds Mapbox access tokens to custom style URLs", () => {
    const styleUrl = resolveMapLibreStyle({
      provider: "mapbox",
      accessToken: "token-1",
      styleUrl: "https://api.mapbox.com/styles/v1/demo/style.json",
    });

    expect(styleUrl).toContain("access_token=token-1");
  });

  it("rejects unsupported providers without a style URL", () => {
    expect(() => resolveMapLibreStyle({ provider: "google", apiKey: "key" })).toThrow(
      /requires a MapLibre styleUrl/i,
    );
  });
});
