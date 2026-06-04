# Rich Primitives

Map Kit exposes declarative React primitives that keep the same app code working across Leaflet,
MapLibre, Mapbox, and Google Maps.

## Marker

```tsx
<Marker
  id="warehouse-delhi"
  position={[28.6139, 77.209]}
  title="Delhi warehouse"
  description="Primary NCR hub"
  color="#2563eb"
  label="DL"
  size="lg"
  variant="badge"
>
  <Popup maxWidth={280}>Vehicles are dispatched from this hub.</Popup>
  <Tooltip>Delhi warehouse</Tooltip>
</Marker>
```

Marker options:

- `variant`: `pin`, `dot`, or `badge`
- `size`: `sm`, `md`, or `lg`
- `label`: short text shown inside the marker
- `tooltip`: native hover/title text; can also be provided with `<Tooltip>`
- `popupOptions`: native popup options; can also be provided with `<Popup>`

## Popup

`Popup` renders through the active map engine's native popup or info window.

```tsx
<Popup maxWidth={320} closeButton>
  Arrived at loading point.
</Popup>
```

## Tooltip

`Tooltip` gives markers a lightweight hover/title label.

```tsx
<Tooltip>Live vehicle location</Tooltip>
```

## MapControls

`MapControls` renders a lightweight React overlay inside the map container.

```tsx
<Map controls={{ zoom: false }}>
  <MapControls
    position="top-right"
    fullscreen
    reset={{ center: [28.6139, 77.209], zoom: 10 }}
  />
</Map>
```

Control options:

- `position`: `top-left`, `top-right`, `bottom-left`, or `bottom-right`
- `zoom`: show zoom in/out buttons
- `fullscreen`: show fullscreen toggle
- `reset`: show reset button; pass `{ center, zoom }` for a fixed reset target
