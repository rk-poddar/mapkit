# Map Kit Adapter Contract

This file defines the technical contract every map engine adapter must follow.

Supported adapters:

- `@map-kit/leaflet`
- `@map-kit/maplibre`
- `@map-kit/google-maps`
- `@map-kit/mapbox`

The goal is simple:

> The public React API should stay consistent, while each adapter handles the messy engine-specific implementation internally.

## 1. Contract Principles

1. Core APIs are engine-agnostic.
2. Engine-specific behavior must live inside adapter packages.
3. The common React components should not import Leaflet, MapLibre, Google Maps, or Mapbox directly.
4. Every adapter must expose capability flags.
5. Every adapter must clean up map instances, layers, listeners, and timers.
6. Every adapter must be safe in Next.js App Router client components.
7. Every adapter must keep attribution visible unless the provider explicitly allows otherwise.
8. Escape hatches are allowed, but they must be isolated under `engineOptions`.

## 2. Coordinate Standard

The public API should use `LatLng` because most React developers and dashboard data use latitude first.

```ts
export type LatLng = [lat: number, lng: number];
export type LngLat = [lng: number, lat: number];
```

Rules:

- Public props accept `LatLng`.
- Internal adapter code may convert to `LngLat` where the engine requires it.
- GeoJSON must stay standard `LngLat`.
- Conversion helpers must live in `@map-kit/core`.

```ts
export function toLngLat(position: LatLng): LngLat {
  return [position[1], position[0]];
}

export function toLatLng(position: LngLat): LatLng {
  return [position[1], position[0]];
}
```

## 3. Engine Types

```ts
export type MapEngine = "leaflet" | "maplibre" | "google-maps" | "mapbox";

export type MapProvider =
  | "osm"
  | "carto"
  | "maptiler"
  | "google"
  | "mapbox"
  | "custom";
```

## 4. Public Component Props

The React API should stay stable across engines.

```ts
export type MapProps = {
  engine: MapEngine;
  provider?: MapProvider;
  apiKey?: string;
  center?: LatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  bounds?: LatLngBounds;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  controls?: MapControlOptions;
  attribution?: AttributionOptions;
  engineOptions?: unknown;
  onReady?: (map: MapController) => void;
  onMove?: (event: MapMoveEvent) => void;
  onClick?: (event: MapPointerEvent) => void;
  onError?: (error: MapKitError) => void;
};
```

Common child components:

```ts
export type MarkerProps = {
  id: string;
  position: LatLng;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
  draggable?: boolean;
  popup?: React.ReactNode;
  zIndex?: number;
  onClick?: (event: MarkerEvent) => void;
  onDragEnd?: (position: LatLng) => void;
};

export type RouteProps = {
  id: string;
  coordinates: LatLng[];
  color?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
  fitBounds?: boolean;
  onClick?: (event: RouteEvent) => void;
};

export type CircleProps = {
  id: string;
  center: LatLng;
  radius: number;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  editable?: boolean;
  onChange?: (circle: { center: LatLng; radius: number }) => void;
};

export type PolygonProps = {
  id: string;
  coordinates: LatLng[];
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  editable?: boolean;
  onChange?: (coordinates: LatLng[]) => void;
};
```

## 5. Adapter Interface

Each engine package must implement this interface.

```ts
export type MapAdapter = {
  engine: MapEngine;
  capabilities: MapAdapterCapabilities;

  createMap(options: CreateMapOptions): Promise<MapAdapterInstance>;
  destroyMap(instance: MapAdapterInstance): void;

  setView(instance: MapAdapterInstance, view: MapViewState): void;
  fitBounds(instance: MapAdapterInstance, bounds: LatLngBounds, options?: FitBoundsOptions): void;

  addMarker(instance: MapAdapterInstance, marker: MarkerModel): MapLayerHandle;
  updateMarker(instance: MapAdapterInstance, handle: MapLayerHandle, marker: MarkerModel): void;
  removeMarker(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addRoute(instance: MapAdapterInstance, route: RouteModel): MapLayerHandle;
  updateRoute(instance: MapAdapterInstance, handle: MapLayerHandle, route: RouteModel): void;
  removeRoute(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addCircle(instance: MapAdapterInstance, circle: CircleModel): MapLayerHandle;
  updateCircle(instance: MapAdapterInstance, handle: MapLayerHandle, circle: CircleModel): void;
  removeCircle(instance: MapAdapterInstance, handle: MapLayerHandle): void;

  addPolygon(instance: MapAdapterInstance, polygon: PolygonModel): MapLayerHandle;
  updatePolygon(instance: MapAdapterInstance, handle: MapLayerHandle, polygon: PolygonModel): void;
  removePolygon(instance: MapAdapterInstance, handle: MapLayerHandle): void;
};
```

## 6. Capability Flags

Adapters must declare what they support.

```ts
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
```

Example:

```ts
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
  editableShapes: true,
  clustering: true,
  heatmap: false,
  liveTracking: true,
  routePlayback: true,
  nativePlacesSearch: false,
  nativeDirections: false,
};
```

## 7. Map Controller

React users should get a stable controller from `useMap()`.

```ts
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
```

Rules:

- `getNativeMap()` is the escape hatch.
- It returns `unknown` from the public API.
- Engine packages may expose typed helpers if needed.

## 8. Lifecycle Rules

Every adapter must handle:

- Initial mount
- Resize
- Prop updates
- Child layer add/update/remove
- Unmount cleanup
- Error reporting

Cleanup must remove:

- DOM listeners
- Map engine listeners
- Layers/sources
- Animation frames
- Timers
- WebGL/map instances where applicable

No adapter should leave a map instance attached after React unmount.

## 9. SSR And Next.js Rules

Map rendering must only run on the client.

Rules:

- Packages must not touch `window`, `document`, or browser-only globals at import time.
- Browser-only engine imports must be lazy where required.
- `@map-kit/next` should expose ready-to-use client components.
- Docs must tell users that map components are client components.

Recommended pattern:

```tsx
"use client";

import { Map } from "@map-kit/next";

export function TripMap() {
  return <Map engine="maplibre" center={[28.6139, 77.209]} zoom={10} />;
}
```

## 10. Provider Config Contract

```ts
export type ProviderConfig = {
  provider: MapProvider;
  apiKey?: string;
  tileUrl?: string;
  styleUrl?: string;
  attribution?: string;
  subdomains?: string[];
  maxZoom?: number;
  headers?: Record<string, string>;
};
```

Rules:

- `osm` must include OpenStreetMap attribution by default.
- `carto` must include OpenStreetMap and CARTO attribution by default where applicable.
- `maptiler` must require an API key unless a custom public style URL is supplied.
- `google` must require an API key.
- `mapbox` must require an access token.
- `custom` must require explicit attribution unless the user opts out with an explicit unsafe flag.

## 11. Error Contract

Errors must be normalized.

```ts
export type MapKitErrorCode =
  | "missing-api-key"
  | "missing-attribution"
  | "unsupported-capability"
  | "engine-load-failed"
  | "provider-load-failed"
  | "invalid-coordinates"
  | "map-container-missing";

export type MapKitError = {
  code: MapKitErrorCode;
  message: string;
  engine?: MapEngine;
  provider?: MapProvider;
  cause?: unknown;
};
```

The UI should show useful developer errors in development:

- Missing API key
- Missing CSS
- Missing container height
- Invalid coordinates
- Provider blocked tiles

## 12. Layer Identity Rules

Every layer component must have a stable `id`.

Rules:

- Use `id` to update existing layers.
- Do not recreate markers/routes on every render when data identity is unchanged.
- Adapter should diff or update where possible.
- Route playback should update marker position without unmounting marker DOM.

This is important for smooth vehicle animation and avoiding flicker.

## 13. Engine-Specific Escape Hatches

Escape hatches are allowed but must be explicit.

```tsx
<Map
  engine="mapbox"
  engineOptions={{
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    style: "mapbox://styles/mapbox/streets-v12",
  }}
/>
```

Do not leak engine-specific props into the common API:

Bad:

```tsx
<Map mapboxStyle="..." leafletPreferCanvas />
```

Good:

```tsx
<Map
  engine="leaflet"
  engineOptions={{
    preferCanvas: true,
  }}
/>
```

## 14. Test Contract

Every adapter must pass shared tests:

- Creates map without throwing in client environment.
- Does not import browser globals during SSR import.
- Renders marker.
- Updates marker position without recreating layer.
- Renders route.
- Updates route coordinates.
- Renders circle.
- Renders polygon.
- Fits bounds.
- Cleans up on unmount.
- Reports missing provider key.
- Keeps attribution visible by default.

Recommended test setup:

- Unit tests for core utilities with Vitest.
- Adapter contract tests with jsdom where possible.
- Playwright screenshots for real map rendering.
- Visual smoke tests for Next.js examples.

## 15. Adapter Implementation Order

1. Core types and utilities.
2. React context and component registry.
3. Leaflet adapter.
4. Next.js wrapper.
5. MapLibre adapter.
6. Route playback and live tracking blocks.
7. Google Maps adapter.
8. Mapbox adapter.

Do not implement Google Maps and Mapbox before the common adapter contract is stable.

## 16. Done Criteria

An adapter is production-ready when:

- It passes shared adapter tests.
- It has a quickstart example.
- It documents provider setup.
- It documents attribution/billing requirements.
- It supports common components.
- It cleans up correctly.
- It works in Next.js App Router.
- It has a troubleshooting page.
