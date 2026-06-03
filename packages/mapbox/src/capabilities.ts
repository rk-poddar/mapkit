import type { MapAdapterCapabilities } from "@map-kit/core";

export const mapboxCapabilities: MapAdapterCapabilities = {
  rasterTiles: true,
  vectorTiles: true,
  customStyleJson: true,
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
