# Mapkit

A React and Next.js-first map UI kit with adapters for Leaflet, MapLibre, Google Maps, and Mapbox.

Current implementation status:

- Product blueprint complete.
- AI implementation workflow complete.
- Engine comparison complete.
- Adapter contract complete.
- Adapter parity checklist complete.
- Provider legal and billing guide complete.
- `@map-kit/core` Phase 2 started with framework-agnostic types and utilities.
- `@map-kit/react` Phase 3 started with engine-agnostic React primitives.
- `@map-kit/leaflet` Phase 4 started with the first real map adapter.
- `@map-kit/maplibre` Phase 5 started with the first WebGL adapter.
- `@map-kit/mapbox` Phase 6A started with Mapbox GL adapter parity.
- `@map-kit/google-maps` Phase 6B started with Google Maps adapter parity.
- Phase 7A normalized adapter build outputs and package exports.
- Phase 7B added adapter smoke tests and parity checklist coverage.
- Phase 7C added CI for tests, typechecks, workspace builds, and example builds.
- Phase 7D added browser runtime smoke checks for example apps.
- `examples/next-basic` renders the first Leaflet-powered map.
- `examples/next-maplibre` renders the first MapLibre-powered map.
- `examples/next-mapbox` renders the first Mapbox-powered map when a Mapbox token is provided.
- `examples/next-google-maps` renders the first Google Maps-powered map when a Google Maps API key is provided.

Next phase:

- Start richer map primitives and interaction blocks.

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

Google Maps docs:

- `docs/GOOGLE_MAPS_QUICKSTART.md`

Adapter QA:

- `docs/ADAPTER_PARITY_CHECKLIST.md`

Runtime smoke tests:

```bash
pnpm -r build
pnpm test:e2e
```

Rich primitive docs:

- `docs/RICH_PRIMITIVES.md`

Styled UI docs:

- `docs/STYLED_UI.md`
- `docs/STYLED_UI.md#copy-components-into-your-app`

Registry docs:

- `docs/REGISTRY.md`
