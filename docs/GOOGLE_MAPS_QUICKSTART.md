# Google Maps Quickstart

This guide shows the first Google Maps adapter for Map Kit.

## Install

```bash
pnpm add @map-kit/react @map-kit/google-maps @googlemaps/js-api-loader
```

## Basic Usage

```tsx
"use client";

import { googleMapsAdapter } from "@map-kit/google-maps";
import { Circle, FitBounds, Map, Marker, Popup, Route } from "@map-kit/react";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;

export function ExampleMap() {
  return (
    <Map
      adapter={googleMapsAdapter}
      engine="google-maps"
      provider={{
        provider: "google",
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      }}
      center={delhi}
      zoom={10}
      style={{ minHeight: 520 }}
    >
      <FitBounds bounds={[gurugram, noida]} options={{ padding: 40 }} />
      <Route id="route" coordinates={[gurugram, delhi, noida]} color="#2563eb" width={5} />
      <Circle id="area" center={delhi} radius={7000} color="#0f766e" fillOpacity={0.18} />
      <Marker id="delhi" position={delhi} title="New Delhi">
        <Popup>Google Maps popup content.</Popup>
      </Marker>
    </Map>
  );
}
```

## Provider Notes

Google Maps requires a browser API key:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

Restrict this key in Google Cloud Console by HTTP referrer and enabled APIs before using it in production.

You can pass Google-specific options through `engineOptions`:

```tsx
<Map
  adapter={googleMapsAdapter}
  engine="google-maps"
  provider={{
    provider: "google",
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  }}
  engineOptions={{
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    clickableIcons: false,
  }}
/>
```

## Supported In Phase 6B

- Google Maps JS API loading through `@googlemaps/js-api-loader`.
- Markers.
- InfoWindow popups.
- Route polyline.
- Native circle overlay.
- Native polygon overlay.
- Fit bounds with padding and max zoom cap.
- Click and move events.
- Next.js example with missing-key setup state.

## Not Yet Included

- Advanced marker HTML content.
- Places Autocomplete/Search.
- Directions service rendering.
- Marker clustering.
- Drawing tools.
- Rich React popup portals.
