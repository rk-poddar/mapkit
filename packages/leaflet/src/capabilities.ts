import type { MapAdapterCapabilities } from "@map-kit/core";

export const leafletCapabilities: MapAdapterCapabilities = {
  rasterTiles: true,
  vectorTiles: false,
  customStyleJson: false,
  markers: true,
  htmlMarkers: true,
  popups: true,
  routes: true,
  circles: true,
  polygons: true,
  editableShapes: false,
  clustering: false,
  heatmap: false,
  liveTracking: true,
  routePlayback: true,
  nativePlacesSearch: false,
  nativeDirections: false,
};
