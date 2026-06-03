# Map Kit Provider Legal And Billing Guide

This file defines how the map kit should handle provider attribution, API keys, usage limits, and billing risk.

This is not legal advice. Provider terms change over time. Before releasing the library, verify the latest official terms for every provider.

Primary official references to verify:

- OpenStreetMap tile usage policy: https://operations.osmfoundation.org/policies/tiles/
- CARTO attribution: https://carto.com/attribution/
- MapTiler attribution guide: https://docs.maptiler.com/guides/map-design/attribution/add-attribution/
- MapTiler Cloud terms: https://www.maptiler.com/terms/cloud/
- Google Maps additional terms: https://www.google.com/help/terms_maps/
- Google Maps Platform terms: https://cloud.google.com/maps-platform/terms
- Mapbox attribution docs: https://docs.mapbox.com/help/getting-started/attribution/
- Mapbox terms: https://www.mapbox.com/legal/tos

## 1. Product Rule

The map kit must not hide legal, billing, or attribution requirements.

It should make provider requirements obvious through:

- Setup docs
- CLI warnings
- Runtime development warnings
- Strong TypeScript config
- Default attribution controls
- Missing key errors
- Provider comparison docs

The library should help developers avoid accidental production mistakes.

## 2. Provider Categories

### Open Data

Examples:

- OpenStreetMap data
- Self-hosted OpenMapTiles
- Self-hosted vector tiles

Important:

- Open data is not the same as free tile hosting.
- OSM data can be free/open, but public tile servers have usage policies.
- Attribution is still required in many cases.

### Free/Public Tile Providers

Examples:

- Public OSM raster tile server
- Public demo tile URLs

Important:

- These are usually not appropriate for heavy production usage.
- They may block apps that violate policy.
- Attribution must be visible.
- The library should not encourage abusing public tile servers.

### Commercial Providers

Examples:

- Google Maps
- Mapbox
- MapTiler Cloud
- CARTO

Important:

- API keys/tokens are usually required.
- Billing/quota setup may be required.
- Terms may restrict caching, storage, display, or mixing with other providers.
- Attribution/logo requirements may apply.

### Custom Providers

Examples:

- Internal tile server
- Government GIS server
- Self-hosted tiles
- Enterprise map service

Important:

- User must provide tile/style URL.
- User must provide attribution text.
- User owns compliance responsibility.

## 3. Provider Config Requirements

Recommended provider config:

```ts
export type ProviderConfig = {
  provider: "osm" | "carto" | "maptiler" | "google" | "mapbox" | "custom";
  apiKey?: string;
  accessToken?: string;
  tileUrl?: string;
  styleUrl?: string;
  attribution?: string;
  attributionUrl?: string;
  billingNoticeAccepted?: boolean;
  allowMissingAttribution?: boolean;
};
```

Rules:

- `osm`: include OpenStreetMap attribution by default.
- `carto`: include CARTO and OpenStreetMap attribution by default where applicable.
- `maptiler`: require API key for MapTiler Cloud presets.
- `google`: require API key.
- `mapbox`: require access token.
- `custom`: require attribution unless explicitly disabled.

## 4. Attribution Rules

Attribution should be visible on the map by default.

The kit should provide:

- `AttributionControl`
- Default attribution per provider
- Custom attribution override
- Development warning when attribution is missing

Recommended API:

```tsx
<Map
  engine="leaflet"
  provider="osm"
  attribution={{
    position: "bottom-right",
    visible: true,
  }}
/>
```

Unsafe override:

```tsx
<Map
  engine="leaflet"
  provider="custom"
  attribution={{
    visible: false,
    unsafeAcknowledgement: "I have confirmed this provider does not require attribution.",
  }}
/>
```

The unsafe override should be intentionally verbose so users do not disable attribution casually.

## 5. OpenStreetMap Notes

OpenStreetMap is a data project, not a free unlimited tile CDN.

For public OSM raster tiles:

- Show OpenStreetMap attribution.
- Respect the tile usage policy.
- Do not use public OSM tiles for high-volume production apps.
- Do not bulk download tiles.
- Do not hide or remove attribution.

Recommended product behavior:

- Allow `provider="osm"` for demos and small usage.
- Show docs warning for production.
- Recommend a real tile provider or self-hosted tiles for heavy usage.

Example warning:

```txt
You are using public OpenStreetMap tiles. This is fine for demos and low-volume apps, but production apps should review the OSM tile usage policy or use a dedicated tile provider.
```

## 6. CARTO Notes

CARTO basemaps often use OpenStreetMap data and CARTO styling/hosting.

Recommended behavior:

- Include CARTO attribution.
- Include OpenStreetMap attribution where applicable.
- Document that CARTO terms should be reviewed for production.
- Treat CARTO as a provider preset, not an engine.

Example:

```tsx
<Map engine="leaflet" provider="carto" />
```

## 7. MapTiler Notes

MapTiler is a strong fit for MapLibre because it provides hosted vector styles.

Recommended behavior:

- Require `NEXT_PUBLIC_MAPTILER_KEY` for MapTiler Cloud presets.
- Keep MapTiler attribution visible.
- Document billing/quota requirements.
- Make style URL configurable.

Example:

```tsx
<Map
  engine="maplibre"
  provider="maptiler"
  apiKey={process.env.NEXT_PUBLIC_MAPTILER_KEY}
/>
```

Missing key behavior:

```txt
MapTiler provider requires an API key. Set NEXT_PUBLIC_MAPTILER_KEY or pass apiKey.
```

## 8. Google Maps Notes

Google Maps should be treated as a commercial provider and engine adapter.

Recommended behavior:

- Require API key.
- Document that billing may be required.
- Do not hide Google attribution/logo.
- Do not imply that Google map data can be freely stored or mixed with other providers.
- Keep Google-specific services inside the Google adapter.

Example:

```tsx
<Map
  engine="google-maps"
  provider="google"
  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
/>
```

Missing key behavior:

```txt
Google Maps requires an API key. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY or pass apiKey.
```

## 9. Mapbox Notes

Mapbox should be treated as a commercial provider and engine adapter.

Recommended behavior:

- Require access token.
- Keep Mapbox attribution/logo visible.
- Document billing/quota requirements.
- Support Mapbox style URLs.
- Keep Mapbox-specific services inside the Mapbox adapter.

Example:

```tsx
<Map
  engine="mapbox"
  provider="mapbox"
  accessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
  engineOptions={{
    style: "mapbox://styles/mapbox/streets-v12",
  }}
/>
```

Missing token behavior:

```txt
Mapbox requires an access token. Set NEXT_PUBLIC_MAPBOX_TOKEN or pass accessToken.
```

## 10. API Key Security

Many browser map SDKs require public browser keys.

Rules:

- Public browser keys must use `NEXT_PUBLIC_` only when they are meant to be exposed.
- Secret server keys must never be bundled into client code.
- Docs should explain provider-side restrictions:
  - HTTP referrer restrictions
  - Domain restrictions
  - API restrictions
  - Quota limits
  - Billing alerts

Bad:

```env
GOOGLE_MAPS_SERVER_SECRET=...
```

Good:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
NEXT_PUBLIC_MAPTILER_KEY=...
```

Important:

- Public keys are not secret.
- Users should restrict public keys in the provider dashboard.
- Server-only geocoding/routing keys should be used through API routes.

## 11. CLI Warnings

The CLI should show provider-specific warnings during setup.

Example:

```txt
You selected Mapbox.

Required:
- NEXT_PUBLIC_MAPBOX_TOKEN
- Billing/quota review
- Visible Mapbox attribution

Docs:
https://docs.mapbox.com/help/getting-started/attribution/
```

Example:

```txt
You selected OpenStreetMap public tiles.

This is good for demos and low-volume apps. For production or heavy traffic, review the OSM tile usage policy or use a dedicated provider.
```

## 12. Runtime Development Warnings

Development mode should warn for:

- Missing key/token
- Missing attribution
- Public OSM tiles in a production-like build
- Unsupported engine/provider combination
- Custom provider without attribution

Do not spam warnings on every render.

Use stable one-time warnings:

```ts
warnOnce("missing-mapbox-token", "Mapbox requires NEXT_PUBLIC_MAPBOX_TOKEN.");
```

## 13. Recommended Provider Presets

### Demo Preset

Good for quick examples:

```tsx
<Map engine="leaflet" provider="osm" />
```

Docs must say this is not the recommended high-volume production setup.

### Open-Source Production Preset

Good for serious open-source/vector usage:

```tsx
<Map engine="maplibre" provider="maptiler" />
```

or:

```tsx
<Map engine="maplibre" provider="custom" styleUrl="https://your-style-url/style.json" />
```

### Commercial Presets

Good for teams already on these platforms:

```tsx
<Map engine="google-maps" provider="google" />
<Map engine="mapbox" provider="mapbox" />
```

## 14. Documentation Checklist

Every provider page must include:

- Required package
- Required environment variable
- Billing note
- Attribution note
- Minimal example
- Next.js example
- Troubleshooting
- Link to official terms

Every engine page must include:

- What it is good for
- What it is not good for
- Provider combinations
- SSR notes
- CSS/import notes
- Common blank map fixes

## 15. Release Checklist

Before publishing a release:

- Verify official provider terms.
- Verify attribution text.
- Verify default attribution is visible.
- Verify commercial provider examples require keys.
- Verify no secret keys are documented as client keys.
- Verify CLI warnings are accurate.
- Verify docs include official links.
- Verify examples do not encourage high-volume public OSM tile usage.

## 16. Product Stance

The library should be developer-friendly, but not careless.

Good stance:

> We make maps easy to add, but provider usage, attribution, and billing stay explicit.

Bad stance:

> Install this and ignore provider terms.

The trustworthiness of the project depends on this.
