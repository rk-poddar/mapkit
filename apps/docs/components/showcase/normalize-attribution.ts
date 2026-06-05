import type { Map as MapLibreMap } from "maplibre-gl";

export function normalizeAttribution(nativeMap: MapLibreMap): void {
  nativeMap.resize();

  const attribution = nativeMap.getContainer().querySelector(".maplibregl-ctrl-attrib");
  if (!(attribution instanceof HTMLElement)) {
    return;
  }

  attribution.classList.remove("maplibregl-compact-show");
  attribution.setAttribute("open", "");
}
