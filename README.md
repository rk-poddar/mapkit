# Mapkit

A React and Next.js-first map UI kit with adapters for Leaflet, MapLibre, Google Maps, and Mapbox.

Current implementation status:

- Product blueprint complete.
- AI implementation workflow complete.
- Engine comparison complete.
- Adapter contract complete.
- Provider legal and billing guide complete.
- `@map-kit/core` Phase 2 started with framework-agnostic types and utilities.
- `@map-kit/react` Phase 3 started with engine-agnostic React primitives.
- `@map-kit/leaflet` Phase 4 started with the first real map adapter.
- `@map-kit/maplibre` Phase 5 started with the first WebGL adapter.
- `@map-kit/mapbox` Phase 6A started with Mapbox GL adapter parity.
- `examples/next-basic` renders the first Leaflet-powered map.
- `examples/next-maplibre` renders the first MapLibre-powered map.
- `examples/next-mapbox` renders the first Mapbox-powered map when a Mapbox token is provided.

Next phase:

- Add the Google Maps adapter baseline.

Run the basic example:

```bash
pnpm --filter @map-kit/example-next-basic dev
```

Leaflet docs:

- `docs/LEAFLET_QUICKSTART.md`

MapLibre docs:

- `docs/MAPLIBRE_QUICKSTART.md`

Mapbox docs:

- `docs/MAPBOX_QUICKSTART.md`
