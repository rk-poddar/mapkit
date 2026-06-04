import type { MapAdapterCapabilities } from "@map-kit/core";

export const googleMapsCapabilities: MapAdapterCapabilities = {
  rasterTiles: false,
  vectorTiles: true,
  customStyleJson: false,
  markers: true,
  htmlMarkers: false,
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
