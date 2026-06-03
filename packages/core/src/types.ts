export type LatLng = readonly [lat: number, lng: number];
export type LngLat = readonly [lng: number, lat: number];

export type LatLngBounds = readonly [southWest: LatLng, northEast: LatLng];

export type MapEngine = "leaflet" | "maplibre" | "google-maps" | "mapbox";

export type MapProvider =
  | "osm"
  | "carto"
  | "maptiler"
  | "google"
  | "mapbox"
  | "custom";

export type MapKitErrorCode =
  | "missing-api-key"
  | "missing-attribution"
  | "unsupported-capability"
  | "engine-load-failed"
  | "provider-load-failed"
  | "invalid-coordinates"
  | "invalid-bounds"
  | "invalid-route"
  | "map-container-missing";

export type MapKitError = {
  code: MapKitErrorCode;
  message: string;
  engine?: MapEngine;
  provider?: MapProvider;
  cause?: unknown;
};

export type ProviderConfig = {
  provider: MapProvider;
  apiKey?: string;
  accessToken?: string;
  tileUrl?: string;
  styleUrl?: string;
  attribution?: string;
  attributionUrl?: string;
  subdomains?: string[];
  maxZoom?: number;
  headers?: Record<string, string>;
  billingNoticeAccepted?: boolean;
  allowMissingAttribution?: boolean;
};

export type AttributionOptions = {
  visible?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  content?: string;
  unsafeAcknowledgement?: string;
};

export type MapControlOptions = {
  zoom?: boolean;
  fullscreen?: boolean;
  attribution?: boolean;
  scale?: boolean;
};

export type CameraOptions = {
  animate?: boolean;
  durationMs?: number;
  padding?: number | FitBoundsPadding;
};

export type FitBoundsPadding = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type FitBoundsOptions = CameraOptions & {
  maxZoom?: number;
};

export type MapViewState = {
  center: LatLng;
  zoom?: number;
};

export type MapPointerEvent = {
  position: LatLng;
  originalEvent?: unknown;
};

export type MapMoveEvent = {
  center: LatLng;
  zoom: number;
  bounds?: LatLngBounds;
  originalEvent?: unknown;
};

export type MarkerEvent = MapPointerEvent & {
  markerId: string;
};

export type RouteEvent = MapPointerEvent & {
  routeId: string;
};

export type BaseLayerModel = {
  id: string;
  visible?: boolean;
  zIndex?: number;
};

export type MarkerModel = BaseLayerModel & {
  position: LatLng;
  title?: string;
  description?: string;
  popup?: string;
  color?: string;
  draggable?: boolean;
};

export type RouteModel = BaseLayerModel & {
  coordinates: LatLng[];
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
};

export type CircleModel = BaseLayerModel & {
  center: LatLng;
  radius: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  editable?: boolean;
};

export type PolygonModel = BaseLayerModel & {
  coordinates: LatLng[];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  editable?: boolean;
};

export type MapLayerHandle = {
  id: string;
  nativeLayer: unknown;
  dispose?: () => void;
};

export type MapAdapterInstance = {
  engine: MapEngine;
  nativeMap: unknown;
  container: HTMLElement;
};

export type CreateMapOptions = {
  container: HTMLElement;
  center?: LatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  bounds?: LatLngBounds;
  provider?: ProviderConfig;
  controls?: MapControlOptions;
  attribution?: AttributionOptions;
  engineOptions?: unknown;
  onReady?: (map: MapController) => void;
  onMove?: (event: MapMoveEvent) => void;
  onClick?: (event: MapPointerEvent) => void;
  onError?: (error: MapKitError) => void;
};

export type MapAdapterCapabilities = {
  rasterTiles: boolean;
  vectorTiles: boolean;
  customStyleJson: boolean;
  markers: boolean;
  htmlMarkers: boolean;
  popups: boolean;
  routes: boolean;
  circles: boolean;
  polygons: boolean;
  editableShapes: boolean;
  clustering: boolean;
  heatmap: boolean;
  liveTracking: boolean;
  routePlayback: boolean;
  nativePlacesSearch: boolean;
  nativeDirections: boolean;
};

export type MapAdapter = {
  engine: MapEngine;
  capabilities: MapAdapterCapabilities;

  createMap(options: CreateMapOptions): Promise<MapAdapterInstance>;
  destroyMap(instance: MapAdapterInstance): void;

  setView(instance: MapAdapterInstance, view: MapViewState): void;
  fitBounds(
    instance: MapAdapterInstance,
    bounds: LatLngBounds,
    options?: FitBoundsOptions,
  ): void;

  addMarker(instance: MapAdapterInstance, marker: MarkerModel): MapLayerHandle;
  updateMarker(
    instance: MapAdapterInstance,
    handle: MapLayerHandle,
    marker: MarkerModel,
  ): void;
  removeMarker(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addRoute(instance: MapAdapterInstance, route: RouteModel): MapLayerHandle;
  updateRoute(
    instance: MapAdapterInstance,
    handle: MapLayerHandle,
    route: RouteModel,
  ): void;
  removeRoute(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addCircle(instance: MapAdapterInstance, circle: CircleModel): MapLayerHandle;
  updateCircle(
    instance: MapAdapterInstance,
    handle: MapLayerHandle,
    circle: CircleModel,
  ): void;
  removeCircle(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addPolygon(instance: MapAdapterInstance, polygon: PolygonModel): MapLayerHandle;
  updatePolygon(
    instance: MapAdapterInstance,
    handle: MapLayerHandle,
    polygon: PolygonModel,
  ): void;
  removePolygon(instance: MapAdapterInstance, handle: MapLayerHandle): void;
};

export type MapController = {
  engine: MapEngine;
  getCenter(): LatLng;
  getZoom(): number;
  setView(center: LatLng, zoom?: number, options?: CameraOptions): void;
  fitBounds(bounds: LatLngBounds, options?: FitBoundsOptions): void;
  panTo(center: LatLng, options?: CameraOptions): void;
  resize(): void;
  getNativeMap(): unknown;
};
