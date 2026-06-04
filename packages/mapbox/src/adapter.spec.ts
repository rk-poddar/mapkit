import { describe, expect, it } from "vitest";
import { mapboxAdapter } from "./adapter";
import { mapboxCapabilities } from "./capabilities";
import { resolveMapboxStyle } from "./provider";

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

describe("@map-kit/mapbox", () => {
  it("exports a complete adapter contract", () => {
    expect(mapboxAdapter.engine).toBe("mapbox");
    expect(mapboxAdapter.capabilities).toBe(mapboxCapabilities);
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
      expect(mapboxAdapter[method]).toEqual(expect.any(Function));
    }
  });

  it("declares every capability flag", () => {
    expect(Object.keys(mapboxCapabilities).sort()).toEqual([...requiredCapabilityKeys].sort());
  });

  it("requires an access token", () => {
    expect(() => resolveMapboxStyle()).toThrow(/requires an accessToken/i);
  });

  it("resolves default and custom Mapbox styles", () => {
    expect(resolveMapboxStyle({ provider: "mapbox", accessToken: "token" })).toBe(
      "mapbox://styles/mapbox/streets-v12",
    );
    expect(
      resolveMapboxStyle({
        provider: "mapbox",
        accessToken: "token",
        styleUrl: "mapbox://styles/demo/custom",
      }),
    ).toBe("mapbox://styles/demo/custom");
  });

  it("rejects unsupported providers", () => {
    expect(() => resolveMapboxStyle({ provider: "osm", accessToken: "token" })).toThrow(
      /not supported/i,
    );
  });
});
