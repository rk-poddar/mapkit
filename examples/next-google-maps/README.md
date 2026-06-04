# Next Google Maps Example

Run the first Google Maps-powered Map Kit example:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key \
pnpm --filter @map-kit/example-next-google-maps dev
```

The example renders:

- Google Maps base map through the Google Maps adapter
- Markers
- Route line
- Circle overlay
- Polygon overlay
- Fit bounds

The page shows a setup state when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing, so the
example still builds in CI without a private token.
