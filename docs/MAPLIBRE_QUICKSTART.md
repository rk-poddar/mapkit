# MapLibre Quickstart

This guide shows the first MapLibre adapter for Map Kit.

## Install

```bash
pnpm add @map-kit/react @map-kit/maplibre maplibre-gl
```

## CSS

MapLibre CSS must be loaded once in your app.

For Next.js App Router, import it in `app/layout.tsx`:

```tsx
import "maplibre-gl/dist/maplibre-gl.css";
```

## Basic Usage

```tsx
"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Circle, FitBounds, Map, Marker, Popup, Route } from "@map-kit/react";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;

export function ExampleMap() {
  return (
    <Map
      adapter={mapLibreAdapter}
      engine="maplibre"
      provider="osm"
      center={delhi}
      zoom={10}
      style={{ minHeight: 520 }}
    >
      <FitBounds bounds={[gurugram, noida]} options={{ padding: 40 }} />
      <Route id="route" coordinates={[gurugram, delhi, noida]} color="#2563eb" width={5} />
      <Circle id="area" center={delhi} radius={7000} color="#0f766e" fillOpacity={0.18} />
      <Marker id="delhi" position={delhi} title="New Delhi">
        <Popup>MapLibre popup content.</Popup>
      </Marker>
    </Map>
  );
}
```

## Provider Notes

`provider="osm"` uses a generated MapLibre raster style object with public OpenStreetMap tiles.

For production vector maps, prefer a real style provider:

```tsx
<Map
  adapter={mapLibreAdapter}
  engine="maplibre"
  provider={{
    provider: "maptiler",
    apiKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
  }}
/>
```

You can also pass a custom style URL:

```tsx
<Map
  adapter={mapLibreAdapter}
  engine="maplibre"
  provider={{
    provider: "custom",
    styleUrl: "https://example.com/style.json",
    attribution: "© Your Provider",
  }}
/>
```

## Supported In Phase 5

- OSM raster style fallback.
- CARTO raster style fallback.
- MapTiler style URL support.
- Custom `styleUrl` support.
- HTML markers.
- Route line.
- Circle rendered as a polygon source.
- Polygon fill and outline.
- Fit bounds.

## Not Yet Included

- Vector tile layer presets.
- Symbol/icon layers.
- Clustering.
- Heatmaps.
- Rich React popup portals.
