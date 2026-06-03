# Next Mapbox Example

Run the first Mapbox-powered Map Kit example:

```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your_token \
pnpm --filter @map-kit/example-next-mapbox dev
```

The example renders:

- Mapbox Streets through the Mapbox adapter
- HTML markers
- Route line
- Circle polygon
- Polygon overlay
- Fit bounds

The page shows a setup state when `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is missing, so the
example still builds in CI without a private token.
