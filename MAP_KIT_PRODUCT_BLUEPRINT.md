# React/Next Map Kit Product Blueprint

## 1. Product Vision

Build an open-source, plug-and-play map UI kit for React and Next.js developers.

The product should feel like:

- shadcn/ui for maps.
- Copyable, customizable map components.
- Production-ready map experiences, not only low-level primitives.
- Next.js App Router friendly out of the box.
- Simple enough for a developer to install and show a map in minutes.
- Powerful enough for logistics, fleet, delivery, route planning, geofence, and real-time tracking use cases.

The core positioning:

> A Next.js-first map UI kit with adapters for Leaflet, MapLibre, Google Maps, and Mapbox, with ready-made blocks for fleet, logistics, routing, geofencing, and live tracking.

Do not build only another Leaflet, MapLibre, Google Maps, or Mapbox wrapper. Existing libraries already do that. The unique value is developer experience, plug-and-play setup, one consistent API, and production-ready use-case blocks.

## 2. Inspiration And Differentiation

Inspired by:

- Leaflet: simple, mature, lightweight maps.
- MapLibre GL JS: modern vector maps, performance, advanced styling.
- Google Maps: widely used commercial map provider with strong places/geocoding/ecosystem support.
- Mapbox: premium vector map platform with advanced styling, tiles, geocoding, and navigation ecosystem.
- MapCN: shadcn-style map component registry.
- shadcn/ui: copy-to-codebase components, easy customization, registry-based install.

What should be better than MapCN:

- Next.js App Router support as a first-class feature.
- Adapter architecture: Leaflet for simple maps, MapLibre for open-source vector maps, Google Maps for teams already invested in Google APIs, and Mapbox for teams already invested in Mapbox styles/tokens.
- Safer default provider setup.
- Clear provider abstraction.
- Strong TypeScript APIs.
- Real logistics/fleet blocks.
- Built-in SSR safety.
- No marker asset headaches.
- No CSS setup confusion.
- Optional geofence editor, route playback, live vehicle tracking, clustering, drawing tools.
- Better documentation and examples.
- AI-friendly implementation docs and generated component comments.

## 3. Target Users

Primary users:

- React developers.
- Next.js App Router developers.
- SaaS dashboard builders.
- Logistics/fleet/delivery product teams.
- Internal tool builders.
- Developers who want a usable map without learning low-level map libraries first.

Secondary users:

- Open-source contributors.
- Agencies building location-based dashboards.
- Teams moving from Google Maps/Mapbox to open-source maps.
- Teams that want one React API while switching between Leaflet, MapLibre, Google Maps, or Mapbox.

## 4. Core Problem

Using maps in React/Next.js is still annoying:

- `window is not defined` in SSR.
- CSS imports are unclear.
- Marker icon paths break in bundlers.
- Tile provider setup is confusing.
- Leaflet plugins are not React-friendly.
- MapLibre needs style JSON/provider knowledge.
- Drawing/geofence/routing examples are scattered.
- Most libraries expose low-level primitives but not complete app workflows.
- Next.js users need dynamic imports and client-only wrappers.

This library should remove that friction.

## 5. Product Principles

1. Plug-and-play first.
2. Escape hatches always available.
3. Next.js should work without manual dynamic imports by the user.
4. Components should be customizable after install.
5. Use open-source maps by default.
6. Avoid vendor lock-in.
7. Keep primitives simple.
8. Provide high-value blocks for real workflows.
9. Treat map provider attribution and usage limits responsibly.
10. Make examples production-like, not toy demos.

## 6. Technical Direction

Use a monorepo.

Recommended tooling:

- pnpm workspaces
- TypeScript
- Vite for packages
- Next.js docs/demo app
- Tailwind CSS
- shadcn-style registry support
- tsup or unbuild for package builds
- Changesets for releases
- Vitest for unit tests
- Playwright for visual/integration tests

Suggested repo structure:

```txt
map-kit/
  apps/
    docs/
    playground/
  packages/
    core/
    react/
    next/
    leaflet/
    maplibre/
    google-maps/
    mapbox/
    draw/
    routing/
    registry/
    cli/
  examples/
    next-basic/
    next-logistics/
    vite-basic/
  docs/
  registry/
```

## 7. Package Architecture

### `@map-kit/core`

Framework-agnostic types and utilities.

Responsibilities:

- Shared types.
- Coordinate helpers.
- Bounds helpers.
- Route helpers.
- Provider config types.
- GeoJSON helpers.
- Distance helpers.
- Common map events.

Example types:

```ts
export type LngLat = [lng: number, lat: number];
export type LatLng = [lat: number, lng: number];

export type MapProvider =
  | "osm"
  | "carto"
  | "maptiler"
  | "google"
  | "mapbox"
  | "custom";

export type MapEngine = "leaflet" | "maplibre" | "google-maps" | "mapbox";

export type MarkerInput = {
  id: string;
  position: LatLng;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
};

export type RouteInput = {
  id: string;
  coordinates: LatLng[];
  color?: string;
  width?: number;
  dashed?: boolean;
};
```

### `@map-kit/react`

React primitives independent of Next.js.

Responsibilities:

- Engine-agnostic component API.
- React context.
- Hooks like `useMap`, `useMapReady`, `useMapBounds`.
- Base components shared by adapters.

Example API:

```tsx
<Map engine="maplibre" provider="osm" center={[28.61, 77.2]} zoom={10}>
  <Marker id="delhi" position={[28.61, 77.2]} title="Delhi" />
  <Route id="route-1" coordinates={route} />
</Map>
```

### `@map-kit/next`

Next.js-safe exports.

Responsibilities:

- Client-only map components.
- Internally handle dynamic import or client boundaries.
- App Router examples.
- CSS integration helpers.
- No user-facing SSR crash.

Example:

```tsx
import { Map, Marker } from "@map-kit/next";

export default function Page() {
  return (
    <Map center={[28.61, 77.2]} zoom={10}>
      <Marker id="delhi" position={[28.61, 77.2]} />
    </Map>
  );
}
```

### `@map-kit/leaflet`

Leaflet adapter.

Use cases:

- Simple maps.
- Raster tiles.
- Admin panels.
- Geofencing.
- Basic markers/routes.
- Lightweight dashboards.

Must handle:

- Leaflet CSS.
- Default marker icon paths.
- SSR safety.
- Resize invalidation.
- Circle/polygon/polyline primitives.

### `@map-kit/maplibre`

MapLibre adapter.

Use cases:

- Vector maps.
- Advanced styling.
- Many markers/layers.
- Clustering.
- Route playback.
- Real-time vehicle movement.
- Heatmaps.
- 3D/terrain in future.

Must handle:

- MapLibre CSS.
- Style URL/provider setup.
- GeoJSON source/layer management.
- Fit bounds.
- Camera controls.
- Custom controls.
- Safe cleanup.

### `@map-kit/google-maps`

Google Maps adapter.

Use cases:

- Teams already using Google Maps Platform.
- Apps that need Google Places, Geocoding, Directions, or Autocomplete integration.
- Consumer-facing maps where Google map familiarity matters.
- Businesses that already have Google Maps billing/accounts.

Must handle:

- API key loading.
- Script loading only once.
- Next.js-safe client loading.
- Billing/key missing warnings.
- Map, marker, popup/info-window.
- Polylines, polygons, circles.
- Fit bounds.
- Places/autocomplete integration as optional add-on.
- Directions integration as optional add-on.

Important:

- Google Maps is not open-source.
- It requires API keys and billing.
- Usage quotas and terms must be documented clearly.
- Do not make Google Maps the default provider.

### `@map-kit/mapbox`

Mapbox adapter.

Use cases:

- Teams already using Mapbox tokens/styles.
- Premium vector tiles.
- Custom Mapbox Studio styles.
- Navigation/geocoding ecosystem.
- High-polish consumer map UI.

Must handle:

- Access token setup.
- Style URL setup.
- Next.js-safe client loading.
- Token missing warnings.
- Map, marker, popup.
- GeoJSON layers for routes/polygons.
- Fit bounds.
- Optional geocoder/navigation integrations.

Important:

- Mapbox is commercial and token-based.
- It has usage-based pricing and terms.
- For open-source-first users, MapLibre should remain the recommended vector-map default.

### `@map-kit/draw`

Drawing and geofence tools.

Features:

- Draw polygon.
- Draw circle.
- Draw rectangle.
- Edit existing shape.
- Delete shape.
- Radius control.
- Export GeoJSON.
- Import GeoJSON.
- Validation.

Important:

- For circle geofence, do not expose many editable polygon points by default.
- Circle should use center + radius model.
- Provide radius slider/input.
- Provide optional edit handle on circle edge.

### `@map-kit/routing`

Routing utilities and components.

Features:

- Route polyline.
- Suggested route vs actual route.
- Route legend.
- OSRM integration helper.
- Custom route provider support.
- Route playback.
- Moving marker.
- Speed controls.
- Pause/resume/reset.
- Follow vehicle option.
- Stop hold behavior.

## 8. Registry And CLI

The product should support shadcn-style copy installation.

Example commands:

```bash
npx map-kit init
npx map-kit add map
npx map-kit add geofence-editor
npx map-kit add route-playback
npx map-kit add live-fleet-map
```

CLI responsibilities:

- Detect Next.js/Vite.
- Detect Tailwind.
- Detect TypeScript.
- Add required dependencies.
- Copy components into user project.
- Add CSS import or instructions.
- Add env variable examples.
- Add provider config file.
- Avoid overwriting user files without confirmation.

Generated files example:

```txt
src/components/map/
  map.tsx
  marker.tsx
  route.tsx
  controls.tsx
  provider.ts
  types.ts
```

## 9. Provider Strategy

Avoid unsafe defaults that surprise users commercially.

The library should support four engines:

1. `leaflet`
2. `maplibre`
3. `google-maps`
4. `mapbox`

Recommended defaults:

- Default simple/raster engine: `leaflet`.
- Default open-source vector engine: `maplibre`.
- Commercial provider adapters: `google-maps`, `mapbox`.

Do not make Google Maps or Mapbox the default because they require keys, billing, and provider-specific terms.

Provider presets:

### OSM Raster

Good for demos and small usage.

Warning:

- Must include attribution.
- Heavy production usage should use a proper tile provider.

### CARTO

Good visual default, but mention commercial terms.

### MapTiler

Good vector option.

Requires API key.

### Custom

Allow user-provided tile URL or style URL.

Example:

```tsx
<Map
  provider={{
    type: "custom-raster",
    tileUrl: "https://tiles.example.com/{z}/{x}/{y}.png",
    attribution: "© Example Maps",
  }}
/>
```

For MapLibre:

```tsx
<Map
  engine="maplibre"
  provider={{
    type: "custom-style",
    styleUrl: "/map-style.json",
  }}
/>
```

For Google Maps:

```tsx
<Map
  engine="google-maps"
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
  center={[28.6139, 77.209]}
  zoom={11}
/>
```

For Mapbox:

```tsx
<Map
  engine="mapbox"
  token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  styleUrl="mapbox://styles/mapbox/streets-v12"
  center={[28.6139, 77.209]}
  zoom={11}
/>
```

Environment variables:

```txt
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_MAPTILER_KEY=
```

Commercial adapter rule:

- If required key/token is missing, render a clear developer error state.
- Never silently fail with a blank map.
- Docs must mention billing, quota, and terms.

## 10. Component API Design

Keep APIs simple for beginners.

### Basic Map

```tsx
<Map center={[28.6139, 77.209]} zoom={11} provider="osm" />
```

### Engine Selection

```tsx
<Map engine="leaflet" provider="osm" center={[28.6139, 77.209]} zoom={11} />

<Map
  engine="maplibre"
  provider="maptiler"
  apiKey={process.env.NEXT_PUBLIC_MAPTILER_KEY}
  center={[28.6139, 77.209]}
  zoom={11}
/>

<Map
  engine="google-maps"
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
  center={[28.6139, 77.209]}
  zoom={11}
/>

<Map
  engine="mapbox"
  token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  styleUrl="mapbox://styles/mapbox/streets-v12"
  center={[28.6139, 77.209]}
  zoom={11}
/>
```

The top-level component should keep one consistent React API where possible, while allowing engine-specific escape hatches.

### Markers

```tsx
<Map center={[28.6139, 77.209]} zoom={11}>
  <Marker
    id="warehouse"
    position={[28.6139, 77.209]}
    title="Warehouse"
    description="Primary distribution center"
  />
</Map>
```

### Declarative Data API

```tsx
<Map
  center={[28.6139, 77.209]}
  zoom={11}
  markers={[
    {
      id: "truck-1",
      position: [28.61, 77.2],
      title: "HR55AP0277",
      status: "moving",
    },
  ]}
  routes={[
    {
      id: "route-1",
      coordinates,
      color: "#2563eb",
    },
  ]}
/>
```

### Geofence

```tsx
<GeofenceEditor
  type="circle"
  center={[28.6139, 77.209]}
  radius={500}
  onChange={(geofence) => setGeofence(geofence)}
/>
```

### Route Playback

```tsx
<RoutePlaybackMap
  route={actualRoute}
  stops={stops}
  vehicleIcon="truck"
  initialSpeed={1}
  stopHoldMs={2500}
/>
```

## 11. Use-Case Blocks

These are the biggest differentiator.

### `basic-map`

Simple map with marker.

### `searchable-map`

Map with search input, geocode callback, and selected marker.

### `geofence-editor`

Create/edit circle or polygon geofence.

Features:

- Circle radius input.
- Polygon edit mode.
- Draw controls.
- GeoJSON output.

### `route-map`

Origin, destination, via points, suggested route.

### `trip-tracking-map`

Fleet/logistics map showing:

- Origin marker.
- Destination marker.
- Current vehicle marker.
- Actual traversed route.
- Remaining route.
- Route legend.

### `route-playback`

Completed trip playback:

- Start/pause/resume.
- Stop/reset.
- Speed options: `0.25x`, `0.5x`, `1x`, `2x`.
- Follow vehicle toggle.
- Stop markers.
- Stop hold behavior.
- Progress bar.

### `fleet-live-map`

Multiple live vehicles:

- Clustering.
- Status colors.
- Vehicle tooltip.
- Fit to fleet.
- Search/filter vehicles.

### `delivery-tracker`

Consumer-style tracking:

- Driver marker.
- Route line.
- ETA card.
- Status timeline.

### `analytics-map`

Heatmap, region stats, clusters.

## 12. Design Language

The library should feel:

- Clean.
- Dashboard-ready.
- Not overdecorated.
- Tailwind-friendly.
- shadcn-compatible.
- Professional for SaaS and operations tools.

Avoid:

- Heavy gradients.
- Decorative blobs.
- Marketing-style hero UI.
- Overly rounded components.
- Hardcoded brand colors without token support.

Use:

- 6-8px border radius.
- Neutral surfaces.
- Thin borders.
- Clear hover/focus states.
- Compact controls.
- Accessible colors.

## 13. Accessibility

Maps are hard for accessibility, but controls must be good.

Requirements:

- Keyboard accessible map controls.
- Buttons with labels.
- Tooltips for icon-only controls.
- ARIA labels for zoom/fullscreen/draw actions.
- Reduced motion support for playback animation.
- High contrast controls.
- Focus rings.

## 14. SSR And Next.js Requirements

Must support:

- Next.js App Router.
- Client components.
- No `window is not defined`.
- No hydration mismatch.
- Dynamic import hidden from user.
- Good loading state.
- Map resizes correctly in tabs/sheets/dialogs.

Important scenarios:

- Map inside a Dialog.
- Map inside a Sheet.
- Map inside Tabs.
- Map inside hidden container that becomes visible.
- Fullscreen map.
- Route playback inside sheet.

## 15. Performance Requirements

For simple maps:

- Fast initial render.
- Lazy load map engine.
- Avoid rerendering map instance unnecessarily.

For MapLibre:

- Use GeoJSON sources/layers for many points.
- Use clustering for 500+ markers.
- Avoid React rendering thousands of DOM markers.
- Update data source instead of remounting map.

For route playback:

- Use requestAnimationFrame.
- Avoid state updates every frame if possible.
- Use refs for marker movement.
- Throttle camera follow.

## 16. Testing Strategy

### Unit Tests

- Coordinate conversions.
- Bounds calculations.
- Route progress calculations.
- Geofence serialization.
- Provider config validation.

### Component Tests

- Map renders without crashing.
- No SSR crash in Next.js.
- Controls render.
- Markers render.

### Playwright Tests

- Basic map visible.
- Marker visible.
- Route visible.
- Geofence draw/edit.
- Route playback starts/stops.
- Fullscreen controls visible.

### Visual Tests

- Screenshot for each block.
- Desktop/mobile viewports.
- Light/dark mode if supported.

## 17. Documentation Plan

Docs should include:

- Getting started.
- Next.js setup.
- Vite setup.
- Provider setup.
- Basic map.
- Markers.
- Popups.
- Routes.
- Geofences.
- Drawing.
- Route playback.
- Live tracking.
- Engine selection guide: Leaflet vs MapLibre vs Google Maps vs Mapbox.
- Provider/license guide.
- Common issues.

Common issues page:

- `window is not defined`.
- Map is blank.
- Map height is zero.
- Marker icon not showing.
- Tiles not loading.
- CORS issue.
- Provider API key missing.
- Map inside tabs/dialog not sizing.

## 18. Initial MVP Scope

Do not build everything first.

MVP should include:

1. Next.js-safe `Map`.
2. Leaflet adapter.
3. MapLibre adapter.
4. Marker.
5. Popup.
6. Polyline/route.
7. Circle/polygon.
8. Fit bounds.
9. Provider presets.
10. CLI add command.
11. `basic-map` block.
12. `geofence-editor` block.
13. `trip-tracking-map` block.
14. Documentation website.

Avoid in MVP:

- 3D terrain.
- Complex analytics.
- Offline maps.
- Full routing backend.
- Full geocoding backend.
- Google Maps adapter.
- Mapbox adapter.

Reason:

- MVP should prove the open-source engine experience first.
- Google Maps and Mapbox require billing/token docs and provider-specific details.
- Commercial adapters should be Phase 8 after the core API is stable.

## 19. Suggested Implementation Phases

### Phase 1: Foundation

- Create monorepo.
- Setup TypeScript.
- Setup docs app.
- Setup package build.
- Define core types.
- Create provider abstraction.
- Create basic Map component.

### Phase 2: Leaflet Adapter

- Render map.
- Render tile layer.
- Render marker.
- Render popup.
- Render polyline.
- Render polygon/circle.
- Fix default marker icon.
- Add fit bounds.

### Phase 3: MapLibre Adapter

- Render map.
- Load style.
- Render markers.
- Render GeoJSON route layers.
- Fit bounds.
- Controls.
- Clustering helper.

### Phase 4: Next.js Package

- Client-only exports.
- App Router examples.
- Safe dynamic imports.
- CSS setup.

### Phase 5: Registry And CLI

- Registry JSON.
- Add command.
- Copy components.
- Dependency detection.
- Tailwind/shadcn support.

### Phase 6: Blocks

- Basic map.
- Geofence editor.
- Trip tracking map.
- Route playback.
- Live fleet map.

### Phase 7: Polish

- Docs.
- Examples.
- Tests.
- Visual regression.
- Release workflow.

### Phase 8: Commercial Provider Adapters

- Add `@map-kit/google-maps`.
- Add `@map-kit/mapbox`.
- Add API key/token validation.
- Add provider-specific docs.
- Add examples for Google Maps and Mapbox.
- Add migration guide between engines.
- Add tests for missing key states.
- Add license/billing warnings in docs and CLI output.

## 20. AI Implementation Prompt

Use this prompt with an AI coding model:

```txt
You are building an open-source map UI kit for React and Next.js developers.

The product is a Next.js-first, shadcn-inspired map component library with adapters for Leaflet, MapLibre, Google Maps, and Mapbox.

Do not create only a thin wrapper around Leaflet, MapLibre, Google Maps, or Mapbox. Build a developer-experience focused toolkit:

- SSR-safe Next.js map components
- provider presets
- markers, popups, routes, polygons, circles
- fit bounds
- geofence editor
- route playback
- live fleet map block
- registry/CLI install model

Create a monorepo with packages:

- @map-kit/core
- @map-kit/react
- @map-kit/next
- @map-kit/leaflet
- @map-kit/maplibre
- @map-kit/google-maps
- @map-kit/mapbox
- @map-kit/draw
- @map-kit/routing
- @map-kit/cli

Use TypeScript, React, Tailwind, and a docs app.

The first implementation goal:

1. Create core types.
2. Implement a Next.js-safe Map component.
3. Implement Leaflet adapter.
4. Implement MapLibre adapter.
5. Implement Marker, Popup, Route, Circle, Polygon, FitBounds.
6. Add a basic-map block.
7. Add a geofence-editor block.
8. Add a trip-tracking-map block.
9. Add docs and examples.

Do not implement Google Maps and Mapbox in the first MVP unless the core API is already stable. Add them later as commercial provider adapters with billing, quota, token, and license documentation.

Make all APIs simple and beginner-friendly.

Example desired API:

<Map center={[28.6139, 77.209]} zoom={11} provider="osm">
  <Marker id="warehouse" position={[28.6139, 77.209]} title="Warehouse" />
  <Route id="route-1" coordinates={routeCoordinates} />
</Map>

Make sure it works in Next.js App Router without users manually writing dynamic imports.
```

## 21. Example Public README Positioning

```md
# Map Kit

Production-ready map components for React and Next.js.

Map Kit gives you plug-and-play maps, markers, routes, geofences, and live tracking blocks powered by Leaflet, MapLibre, Google Maps, and Mapbox adapters.

## Features

- Next.js App Router ready
- Leaflet, MapLibre, Google Maps, and Mapbox adapters
- shadcn-style install
- TypeScript-first
- Provider presets
- Markers, popups, routes, polygons, circles
- Geofence editor
- Route playback
- Live fleet tracking blocks

## Quick Start

npx map-kit init
npx map-kit add basic-map

```

## 22. Naming Ideas

Possible names:

- MapKit React
- NextMap Kit
- OpenMap UI
- MapStack UI
- RouteKit
- GeoKit UI
- Atlas UI
- MapBlocks
- NavKit UI

Choose a name that is not already heavily used in npm/GitHub.

## 23. Risks

### Risk: Too Broad

Do not build every map feature at once. Start with a focused MVP.

### Risk: Existing Competition

React Leaflet, react-maplibre, Google Maps React wrappers, and Mapbox React wrappers already exist. Avoid competing as a low-level wrapper.

### Risk: Provider Licensing

Clearly document tile provider terms, API key requirements, billing rules, and commercial provider limitations.

### Risk: SSR Complexity

Make Next.js compatibility a first-class test target.

### Risk: Performance

Do not render thousands of DOM markers. Use layers/clustering for heavy datasets.

## 24. Final Recommendation

Build this.

But build it as a map UI kit and workflow library, not as another map wrapper.

The strongest niche:

> Plug-and-play map blocks for React and Next.js apps, especially logistics/fleet/delivery workflows, powered by Leaflet, MapLibre, Google Maps, and Mapbox adapters.

Start with:

1. Basic map.
2. Marker/popup.
3. Route line.
4. Geofence editor.
5. Trip tracking map.
6. Route playback.

Then grow into:

1. Live fleet map.
2. Clustering.
3. Analytics heatmap.
4. Drawing toolkit.
5. CLI/registry ecosystem.
6. Google Maps adapter.
7. Mapbox adapter.
