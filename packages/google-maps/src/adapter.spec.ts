import { describe, expect, it } from "vitest";
import { googleMapsAdapter } from "./adapter";
import { googleMapsCapabilities } from "./capabilities";
import { resolveGoogleMapId, resolveGoogleMapsProvider } from "./provider";

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

describe("@map-kit/google-maps", () => {
  it("exports a complete adapter contract", () => {
    expect(googleMapsAdapter.engine).toBe("google-maps");
    expect(googleMapsAdapter.capabilities).toBe(googleMapsCapabilities);
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
      expect(googleMapsAdapter[method]).toEqual(expect.any(Function));
    }
  });

  it("declares every capability flag", () => {
    expect(Object.keys(googleMapsCapabilities).sort()).toEqual([...requiredCapabilityKeys].sort());
  });

  it("requires a Google API key", () => {
    expect(() => resolveGoogleMapsProvider()).toThrow(/requires an apiKey/i);
  });

  it("resolves API keys and map IDs", () => {
    expect(resolveGoogleMapsProvider({ provider: "google", apiKey: "key-1" })).toEqual({
      apiKey: "key-1",
    });
    expect(
      resolveGoogleMapId({
        container: {} as HTMLElement,
        engineOptions: { mapId: "map-id-1" },
      }),
    ).toBe("map-id-1");
  });

  it("rejects unsupported providers", () => {
    expect(() => resolveGoogleMapsProvider({ provider: "mapbox", accessToken: "token" })).toThrow(
      /not supported/i,
    );
  });
});
