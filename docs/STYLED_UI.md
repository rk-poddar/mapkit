# Styled UI

Map Kit keeps map behavior and visual styling in separate packages:

- `@map-kit/react`: headless React primitives and map lifecycle
- `@map-kit/ui`: Tailwind-friendly styled components
- `@map-kit/cli`: copy-paste installer for app-owned components

This keeps the core package usable in custom design systems while still giving product teams a fast
plug-and-play UI layer.

## Install

```bash
pnpm add @map-kit/react @map-kit/ui
```

Your app should already have Tailwind configured. The UI package ships class names, not compiled CSS.

## Copy Components Into Your App

If you prefer shadcn-style app-owned components, use the CLI instead of importing from `@map-kit/ui`.
The generated files are plain React + Tailwind components that you can edit freely.

```bash
pnpm dlx @map-kit/cli add map-controls popup-card marker-badge map-legend
```

By default files are written to `components/map-kit`.

```txt
components/map-kit/
  map-controls.tsx
  marker-badge.tsx
  popup-card.tsx
  map-legend.tsx
  utils.ts
```

Use a custom output directory when your app keeps UI components somewhere else:

```bash
pnpm dlx @map-kit/cli add --out src/components/map-kit
```

Available registry items:

```bash
pnpm dlx @map-kit/cli list
```

Print the registry index JSON:

```bash
pnpm dlx @map-kit/cli registry
```

Print a full component payload:

```bash
pnpm dlx @map-kit/cli registry map-controls
```

Overwrite an existing generated component:

```bash
pnpm dlx @map-kit/cli add map-controls --force
```

Preview without writing files:

```bash
pnpm dlx @map-kit/cli add map-controls --dry-run
```

## Styled Controls

```tsx
import { Map } from "@map-kit/react";
import { MapControls } from "@map-kit/ui";

<Map controls={{ zoom: false }} engine="leaflet" provider="osm">
  <MapControls
    position="top-right"
    fullscreen
    reset={{ center: [28.6139, 77.209], zoom: 10 }}
  />
</Map>;
```

With copied components, import from your app path instead:

```tsx
import { MapControls } from "@/components/map-kit/map-controls";
```

## Marker Badge

Use `MarkerBadge` when rendering custom marker previews in sidebars, legends, or future HTML-marker
flows.

```tsx
import { MarkerBadge } from "@map-kit/ui";

<MarkerBadge color="#2563eb" label="DL" size="lg" variant="badge" />;
```

## Popup Card

```tsx
import { PopupCard } from "@map-kit/ui";

<PopupCard title="Delhi warehouse" description="Primary NCR hub">
  18 vehicles assigned.
</PopupCard>;
```

## Legend

```tsx
import { MapLegend } from "@map-kit/ui";

<MapLegend
  items={[
    { label: "Actual route", color: "#2563eb" },
    { label: "Suggested route", color: "#94a3b8", dashed: true },
  ]}
/>;
```

## Design Direction

The components follow shadcn-style composition:

- simple props
- Tailwind class strings
- app-owned override via `className`
- no global CSS dependency
- no lock-in to a theme provider

## Registry Contract

The JSON shape is documented in `docs/REGISTRY.md`.
