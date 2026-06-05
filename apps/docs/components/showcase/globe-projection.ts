import type { Map as MapLibreMap } from "maplibre-gl";

export function applyGlobeProjection(map: MapLibreMap): void {
  const enableGlobe = () => {
    window.setTimeout(() => {
      map.setProjection({ type: "globe" });

      if ("setFog" in map && typeof map.setFog === "function") {
        map.setFog({
          color: "rgb(8, 8, 12)",
          "high-color": "rgb(36, 92, 223)",
          "horizon-blend": 0.02,
          "space-color": "rgb(0, 0, 0)",
          "star-intensity": 0.12,
        });
      }
    }, 100);
  };

  if (map.isStyleLoaded()) {
    enableGlobe();
    return;
  }

  map.once("load", enableGlobe);
  map.once("styledata", enableGlobe);
}
