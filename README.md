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
- `examples/next-basic` renders the first Leaflet-powered map.

Next phase:

- Harden the Leaflet adapter and add docs/tests around marker icons, popups, and layer lifecycle.

Run the basic example:

```bash
pnpm --filter @map-kit/example-next-basic dev
```

Leaflet docs:

- `docs/LEAFLET_QUICKSTART.md`
