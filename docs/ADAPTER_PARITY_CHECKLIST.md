# Adapter Parity Checklist

This checklist tracks the baseline features that should behave consistently across supported engines.

| Capability | Leaflet | MapLibre | Mapbox | Google Maps |
| --- | --- | --- | --- | --- |
| Package exports `dist/index.js` | Yes | Yes | Yes | Yes |
| Adapter contract smoke test | Yes | Yes | Yes | Yes |
| Provider resolver smoke test | Yes | Yes | Yes | Yes |
| Capabilities object complete | Yes | Yes | Yes | Yes |
| Marker | Yes | Yes | Yes | Yes |
| Popup | Yes | Yes | Yes | Yes |
| Route/polyline | Yes | Yes | Yes | Yes |
| Circle | Yes | Yes | Yes | Yes |
| Polygon | Yes | Yes | Yes | Yes |
| Fit bounds | Yes | Yes | Yes | Yes |
| Click event | Yes | Yes | Yes | Yes |
| Move event | Yes | Yes | Yes | Yes |
| Missing key/token setup state | Not needed | Not needed | Yes | Yes |
| Next example builds without private credentials | Yes | Yes | Yes | Yes |

## Phase 7B Test Coverage

- Core coordinate, bounds, distance, route progress, and provider validation smoke tests.
- Adapter contract smoke tests for Leaflet, MapLibre, Mapbox, and Google Maps.
- Provider resolver tests for supported and unsupported provider branches.
- Capability completeness checks for all baseline adapters.

## Remaining QA

- Browser runtime screenshots for all examples.
- Token-backed runtime checks for Mapbox and Google Maps.
- Rich popup portal behavior.
- Clustering and heatmap parity once those capabilities are implemented.
- Drawing/editing parity once draw tools are implemented.
