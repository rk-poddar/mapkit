# Mapbox Quickstart

This guide shows the first Mapbox adapter for Map Kit.

## Install

```bash
pnpm add @map-kit/react @map-kit/mapbox mapbox-gl
```

## CSS

Mapbox GL CSS must be loaded once in your app.

For Next.js App Router, import it in a client component or in your app shell:

```tsx
import "mapbox-gl/dist/mapbox-gl.css";
```

## Basic Usage

```tsx
"use client";

import { mapboxAdapter } from "@map-kit/mapbox";
import { Circle, FitBounds, Map, Marker, Popup, Route } from "@map-kit/react";
import "mapbox-gl/dist/mapbox-gl.css";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;

export function ExampleMap() {
  return (
    <Map
      adapter={mapboxAdapter}
      engine="mapbox"
      provider={{
        provider: "mapbox",
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
      }}
      center={delhi}
      zoom={10}
      style={{ minHeight: 520 }}
    >
      <FitBounds bounds={[gurugram, noida]} options={{ padding: 40 }} />
      <Route id="route" coordinates={[gurugram, delhi, noida]} color="#2563eb" width={5} />
      <Circle id="area" center={delhi} radius={7000} color="#0f766e" fillOpacity={0.18} />
      <Marker id="delhi" position={delhi} title="New Delhi">
        <Popup>Mapbox popup content.</Popup>
      </Marker>
    </Map>
  );
}
```

## Provider Notes

Mapbox requires a public access token for browser maps:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token
```

By default, the adapter uses Mapbox Streets:

```txt
mapbox://styles/mapbox/streets-v12
```

You can pass a Mapbox Studio style URL:

```tsx
<Map
  adapter={mapboxAdapter}
  engine="mapbox"
  provider={{
    provider: "mapbox",
    accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    styleUrl: "mapbox://styles/your-account/your-style-id",
  }}
/>
```

## Supported In Phase 6A

- Mapbox Streets default style.
- Custom Mapbox Studio `styleUrl` support.
- HTML markers.
- Popups.
- Route line.
- Circle rendered as a polygon source.
- Polygon fill and outline.
- Fit bounds with sanitized options.
- Next.js example with missing-token setup state.

## Not Yet Included

- Symbol/icon layers.
- Clustering.
- Heatmaps.
- Mapbox services such as Geocoding, Directions, and Search.
- Rich React popup portals.
