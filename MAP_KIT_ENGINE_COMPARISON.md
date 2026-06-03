# Map Kit Engine Comparison

This file is the decision guide for choosing the correct map engine inside the map kit.

Supported engines:

- `leaflet`
- `maplibre`
- `google-maps`
- `mapbox`

Use this file together with:

- `MAP_KIT_PRODUCT_BLUEPRINT.md`
- `MAP_KIT_AI_IMPLEMENTATION_WORKFLOW.md`
- `MAP_KIT_ADAPTER_CONTRACT.md`
- `MAP_KIT_PROVIDER_LEGAL_AND_BILLING.md`

## 1. Executive Recommendation

Do not position the product as a replacement for Leaflet, MapLibre, Google Maps, or Mapbox.

Position it as:

> A React and Next.js map UI kit that gives developers one consistent component API, production-ready map blocks, and engine adapters for Leaflet, MapLibre, Google Maps, and Mapbox.

Recommended engine strategy:

- Start with `leaflet` for the first working MVP.
- Add `maplibre` for the first serious modern engine.
- Add `google-maps` for users who need Google Places, Directions, Geocoding, or existing Google billing.
- Add `mapbox` for users who need Mapbox Studio styles, Mapbox tiles, or existing Mapbox billing.

Recommended default:

- Default open-source/simple setup: `leaflet`.
- Default modern/vector setup: `maplibre`.
- Never make Google Maps or Mapbox the silent default because both require billing/token decisions.

## 2. Comparison Table

| Engine | Best For | Main Strength | Main Risk | Cost Model | Build Priority |
| --- | --- | --- | --- | --- | --- |
| `leaflet` | Dashboards, admin tools, markers, geofences, simple routes | Mature, lightweight, easy to debug | Raster-first, weaker for large dynamic layers | Library is open-source; tile provider may cost | P0 |
| `maplibre` | Vector maps, large routes, live tracking, custom layers | WebGL renderer, vector styles, open-source | More complex setup and style/provider concepts | Library is open-source; tile/style provider may cost | P1 |
| `google-maps` | Places, address search, Directions, consumer-grade map data | Google data and services ecosystem | Billing, quotas, proprietary SDK | Commercial Google Maps Platform billing | P2 |
| `mapbox` | Premium vector styling, Mapbox Studio, polished custom maps | High-quality hosted styles and APIs | Billing, token management, proprietary services | Commercial Mapbox billing | P2 |

## 3. Product Positioning By Engine

### Leaflet

Leaflet should be the first adapter because it gives the fastest route to a usable product.

Use it for:

- Location picker
- Basic map view
- Marker and popup
- Circle geofence
- Polygon geofence
- Polyline route
- Basic clustering
- Admin dashboards

Do not use it as the flagship engine for:

- Heavy animated route playback
- Very large vehicle fleets
- Thousands of frequently changing markers
- Complex data-driven styling
- 3D/globe/terrain

Product messaging:

> Use Leaflet when you want a simple, reliable map in a React or Next.js app with minimum setup.

### MapLibre

MapLibre should become the strongest open-source engine in the kit.

Use it for:

- Modern vector maps
- Large route rendering
- Live fleet tracking
- Route playback
- Data-driven styles
- Vector tile layers
- Clustering
- Heatmaps
- Custom layer rendering

Avoid it when:

- The developer only needs a simple static marker map.
- The user does not understand style JSON or tile providers.
- The product cannot provide sane provider presets.

Product messaging:

> Use MapLibre when you want an open-source modern map engine with vector rendering and high-performance layers.

### Google Maps

Google Maps should be supported because many real businesses already rely on it.

Use it for:

- Places Autocomplete
- Geocoding
- Directions
- Familiar consumer-facing maps
- Address search workflows
- Existing Google Maps Platform customers

Avoid it when:

- The user wants a fully open-source map stack.
- The user wants no billing setup.
- The app needs self-hosted map data.
- The app wants to freely swap tile providers.

Product messaging:

> Use Google Maps when map data quality and Google services matter more than open-source control.

### Mapbox

Mapbox should be supported for teams already invested in Mapbox Studio and Mapbox services.

Use it for:

- Custom branded maps
- Premium vector basemaps
- Mapbox Studio styles
- Polished consumer-facing maps
- Teams already using Mapbox tokens

Avoid it when:

- MapLibre plus a provider like MapTiler/CARTO is enough.
- The user wants no proprietary dependency.
- The user wants all map infrastructure self-hosted.

Product messaging:

> Use Mapbox when your product needs Mapbox styles, tokens, and ecosystem services.

## 4. Feature Matrix

| Feature | Leaflet | MapLibre | Google Maps | Mapbox |
| --- | --- | --- | --- | --- |
| SSR-safe React wrapper | Yes via kit | Yes via kit | Yes via kit | Yes via kit |
| Markers | Strong | Strong | Strong | Strong |
| Popups | Strong | Strong | Strong | Strong |
| Polylines/routes | Strong | Strong | Strong | Strong |
| Circle geofence | Strong | Supported | Supported | Supported |
| Polygon geofence | Strong | Strong | Strong | Strong |
| Drawing tools | Plugin-based | Custom/Mapbox Draw compatible patterns | Native/adapter work | Mapbox Draw patterns |
| Clustering | Plugin-based | Strong | Supported | Strong |
| Vector tiles | Limited | Strong | Provider-controlled | Strong |
| Raster tiles | Strong | Supported | Not the main model | Supported |
| Custom style JSON | No | Yes | No | Yes |
| Places search | External provider | External provider | Strong native ecosystem | Mapbox ecosystem |
| Directions | External provider | External provider | Strong native ecosystem | Mapbox ecosystem |
| Best open-source route | Good | Best | No | No |
| Best plug-and-play route | Best | Good | Requires key | Requires token |

## 5. Developer Experience Goals

The API should feel consistent across engines:

```tsx
<Map engine="leaflet" center={[28.6139, 77.209]} zoom={10} />
<Map engine="maplibre" center={[28.6139, 77.209]} zoom={10} />
<Map engine="google-maps" center={[28.6139, 77.209]} zoom={10} />
<Map engine="mapbox" center={[28.6139, 77.209]} zoom={10} />
```

Common components should work wherever the adapter supports them:

```tsx
<Map engine="maplibre" provider="maptiler" apiKey={process.env.NEXT_PUBLIC_MAPTILER_KEY}>
  <Marker id="origin" position={[28.6139, 77.209]} />
  <Route id="actual-route" coordinates={actualRoute} />
  <Circle id="service-area" center={[28.6139, 77.209]} radius={5000} />
</Map>
```

Engine-specific features must be available through escape hatches:

```tsx
<Map
  engine="maplibre"
  engineOptions={{
    style: "https://api.maptiler.com/maps/streets/style.json?key=...",
    attributionControl: true,
  }}
/>
```

## 6. Decision Tree

Ask these in order:

1. Does the product require Google Places, Directions, or Geocoding quality?
   - Yes: choose `google-maps`.
   - No: continue.

2. Does the product already use Mapbox Studio or Mapbox hosted styles?
   - Yes: choose `mapbox`.
   - No: continue.

3. Does the map need vector layers, large live datasets, animated vehicle movement, heatmaps, or advanced styling?
   - Yes: choose `maplibre`.
   - No: continue.

4. Does the app mostly need markers, popups, geofences, and simple routes?
   - Yes: choose `leaflet`.
   - No: choose `maplibre` as the safer future-proof option.

## 7. Recommended MVP Scope

### MVP 1: Leaflet

Ship:

- `Map`
- `Marker`
- `Popup`
- `Route`
- `Circle`
- `Polygon`
- `FitBounds`
- `MapControls`
- `LocationPicker`
- `GeofenceEditor`
- Next.js App Router example

Reason:

- Fastest time to working demo.
- Best for simple copy-paste examples.
- Easiest to explain to React/Next developers.

### MVP 2: MapLibre

Ship:

- Same public primitives as Leaflet.
- Vector style provider presets.
- Better route rendering.
- Live vehicle tracking block.
- Route playback block.

Reason:

- Makes the project serious for fleet/logistics users.
- Keeps open-source positioning strong.

### MVP 3: Google Maps And Mapbox

Ship:

- Adapter packages.
- Provider setup docs.
- Token/key warnings.
- Billing docs.
- Feature parity where reasonable.

Reason:

- Commercial users need these engines.
- They should not slow down open-source MVP.

## 8. Migration Strategy

The kit should make engine switching possible but not pretend every engine is identical.

Good:

```tsx
<Map engine="leaflet" provider="osm" />
<Map engine="maplibre" provider="maptiler" />
```

Risky:

```tsx
// Do not promise this will look identical across engines.
<Map engine={userSelectedEngine} />
```

Migration promise:

- Common primitives should preserve data shape.
- Visual output may differ.
- Advanced engine-specific options may need rewrite.
- Provider attribution and billing must be reviewed when switching.

## 9. Performance Guidance

Use Leaflet when:

- Marker count is low to medium.
- Data changes are occasional.
- Raster tiles are enough.

Use MapLibre when:

- Routes are long.
- Vehicle movement is animated.
- Layers update frequently.
- The app uses many points, lines, or polygons.

Use Google Maps when:

- Google service quality matters more than full rendering control.

Use Mapbox when:

- Map styling and hosted vector services matter more than open-source control.

## 10. Documentation Pages To Build

Required docs:

- Choosing an engine
- Leaflet quickstart
- MapLibre quickstart
- Google Maps quickstart
- Mapbox quickstart
- Provider attribution and billing
- Next.js SSR guide
- Engine migration guide
- Capability matrix
- Troubleshooting blank maps
- Troubleshooting missing API keys

## 11. Source Notes

Provider terms change over time. Before publishing the library, verify current provider requirements from official docs:

- OpenStreetMap tile usage policy: https://operations.osmfoundation.org/policies/tiles/
- Mapbox attribution docs: https://docs.mapbox.com/help/getting-started/attribution/
- MapTiler attribution docs: https://docs.maptiler.com/guides/map-design/attribution/add-attribution/
- Google Maps additional terms: https://www.google.com/help/terms_maps/
- CARTO attribution docs: https://carto.com/attribution/
