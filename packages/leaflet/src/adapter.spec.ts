import { describe, expect, it } from "vitest";
import { leafletAdapter } from "./adapter";
import { leafletCapabilities } from "./capabilities";
import { resolveLeafletTileConfig } from "./provider";

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

describe("@map-kit/leaflet", () => {
  it("exports a complete adapter contract", () => {
    expect(leafletAdapter.engine).toBe("leaflet");
    expect(leafletAdapter.capabilities).toBe(leafletCapabilities);
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
      expect(leafletAdapter[method]).toEqual(expect.any(Function));
    }
  });

  it("declares every capability flag", () => {
    expect(Object.keys(leafletCapabilities).sort()).toEqual([...requiredCapabilityKeys].sort());
  });

  it("resolves supported tile providers", () => {
    expect(resolveLeafletTileConfig().url).toContain("openstreetmap");
    expect(resolveLeafletTileConfig({ provider: "carto" }).url).toContain("cartocdn");
    expect(resolveLeafletTileConfig({ provider: "maptiler", apiKey: "abc 123" }).url).toContain(
      "abc%20123",
    );
  });

  it("rejects unsupported providers", () => {
    expect(() => resolveLeafletTileConfig({ provider: "google", apiKey: "key" })).toThrow(
      /cannot be rendered/i,
    );
  });
});
