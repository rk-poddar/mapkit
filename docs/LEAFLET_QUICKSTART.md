# Leaflet Quickstart

This guide shows the first working Map Kit engine: Leaflet.

## Install

```bash
pnpm add @map-kit/react @map-kit/leaflet leaflet
```

## CSS

Leaflet CSS must be loaded once in your app.

For Next.js App Router, import it in `app/layout.tsx`:

```tsx
import "leaflet/dist/leaflet.css";
```

Map Kit uses an inline default marker icon, so you do not need to copy Leaflet marker PNG assets.

## Basic Usage

```tsx
"use client";

import { leafletAdapter } from "@map-kit/leaflet";
import { Circle, FitBounds, Map, Marker, Popup, Route } from "@map-kit/react";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;

export function ExampleMap() {
  return (
    <Map
      adapter={leafletAdapter}
      engine="leaflet"
      provider="osm"
      center={delhi}
      zoom={10}
      style={{ minHeight: 520 }}
    >
      <FitBounds bounds={[gurugram, noida]} options={{ padding: 40 }} />
      <Route id="route" coordinates={[gurugram, delhi, noida]} color="#2563eb" width={5} />
      <Circle id="area" center={delhi} radius={7000} color="#0f766e" fillOpacity={0.18} />
      <Marker id="delhi" position={delhi} title="New Delhi">
        <Popup>Declarative popup content.</Popup>
      </Marker>
    </Map>
  );
}
```

## Provider Notes

`provider="osm"` uses public OpenStreetMap raster tiles.

This is useful for demos and low-volume development. For production usage, review the OSM tile usage policy or use a dedicated provider.

## Supported In Phase 4.5

- OSM, CARTO, MapTiler raster, and custom raster tile providers.
- Marker add/update/remove.
- Route add/update/remove.
- Circle add/update/remove.
- Polygon add/update/remove.
- Basic marker popup content.
- Fit bounds.

## Not Yet Included

- Rich React popup portals.
- Marker clustering.
- Drawing/editing tools.
- Leaflet plugin wrappers.
