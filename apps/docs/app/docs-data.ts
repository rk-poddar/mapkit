export type ComponentDoc = {
  category: "control" | "marker" | "overlay";
  command: string;
  description: string;
  fileName: string;
  name: string;
  slug: string;
  source: string;
  tags: string[];
  usage: string;
};

export type ComponentGuide = {
  description: string;
  intro: string;
  name: string;
  preview: "map" | "controls" | "markers" | "popups" | "routes" | "advanced";
  sections: Array<{
    body: string;
    code?: string;
    id: string;
    title: string;
  }>;
  slug: string;
};

export const componentDocs: ComponentDoc[] = [
  {
    category: "control",
    command: "pnpm dlx @map-kit/cli add map-controls",
    description: "Zoom, fullscreen, and reset controls designed for map surfaces.",
    fileName: "map-controls.tsx",
    name: "Map Controls",
    slug: "map-controls",
    source: `import { MapControls as HeadlessMapControls, type MapControlsProps } from "@map-kit/react";
import { cn } from "./utils";

export function MapControls({ className, buttonClassName, ...props }: MapControlsProps) {
  return (
    <HeadlessMapControls
      unstyled
      className={cn("rounded-lg border border-slate-200 bg-white/95 p-1.5 shadow-lg", className)}
      buttonClassName={cn("inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3", buttonClassName)}
      {...props}
    />
  );
}`,
    tags: ["toolbar", "zoom", "fullscreen", "reset"],
    usage: `<Map controls={{ zoom: false }} engine="leaflet" provider="osm">
  <MapControls position="top-right" fullscreen reset={{ center, zoom: 10 }} />
</Map>`,
  },
  {
    category: "marker",
    command: "pnpm dlx @map-kit/cli add marker-badge",
    description: "Small pin, dot, and badge marker visuals for map-adjacent UI.",
    fileName: "marker-badge.tsx",
    name: "Marker Badge",
    slug: "marker-badge",
    source: `export function MarkerBadge({ color = "#2563eb", label, variant = "pin" }) {
  const isPin = variant === "pin";

  return (
    <span
      className={cn("inline-flex items-center justify-center rounded-full text-white shadow-lg", isPin && "-rotate-45")}
      style={{ backgroundColor: color }}
    >
      {label ? <span className={cn(isPin && "rotate-45")}>{label.slice(0, 3)}</span> : null}
    </span>
  );
}`,
    tags: ["marker", "pin", "badge", "preview"],
    usage: `<MarkerBadge color="#2563eb" label="DL" size="lg" variant="badge" />`,
  },
  {
    category: "overlay",
    command: "pnpm dlx @map-kit/cli add popup-card",
    description: "A compact card for popup and overlay content.",
    fileName: "popup-card.tsx",
    name: "Popup Card",
    slug: "popup-card",
    source: `export function PopupCard({ children, description, footer, title }) {
  return (
    <div className="min-w-56 rounded-lg border border-slate-200 bg-white p-3 shadow-xl">
      {title ? <div className="text-sm font-semibold text-slate-950">{title}</div> : null}
      {description ? <div className="mt-1 text-xs text-slate-500">{description}</div> : null}
      {children ? <div className="mt-3 text-sm text-slate-700">{children}</div> : null}
      {footer ? <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div> : null}
    </div>
  );
}`,
    tags: ["popup", "overlay", "card"],
    usage: `<Popup>
  <PopupCard title="Delhi hub" description="Primary NCR warehouse">
    18 vehicles assigned.
  </PopupCard>
</Popup>`,
  },
  {
    category: "overlay",
    command: "pnpm dlx @map-kit/cli add map-legend",
    description: "A route and layer legend card for map overlays.",
    fileName: "map-legend.tsx",
    name: "Map Legend",
    slug: "map-legend",
    source: `export function MapLegend({ items, title = "Map legend" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 p-3 shadow-lg">
      {title ? <div className="mb-2 font-semibold text-slate-950">{title}</div> : null}
      {items.map((item) => (
        <div className="flex items-center gap-2" key={item.label}>
          <span className="h-0.5 w-8 rounded-full" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}`,
    tags: ["legend", "route", "overlay"],
    usage: `<MapLegend
  items={[
    { label: "Actual route", color: "#2563eb" },
    { label: "Suggested route", color: "#94a3b8", dashed: true },
  ]}
/>`,
  },
];

export const engineDocs = [
  ["Leaflet", "Fast setup", "Best for admin panels, logistics tools, and OSM-first apps."],
  ["MapLibre", "Open WebGL", "Best for vector tiles, styling control, and open-source map stacks."],
  ["Mapbox", "Managed WebGL", "Best when teams already use Mapbox styles, tokens, and services."],
  ["Google Maps", "Coverage", "Best when Google Places, traffic, or familiar business maps matter."],
] as const;

export const installSteps = [
  "pnpm add @map-kit/react @map-kit/leaflet leaflet",
  "pnpm dlx @map-kit/cli add map-controls popup-card",
  "import { Map, Marker, Route } from \"@map-kit/react\";",
];

export const componentGuides: ComponentGuide[] = [
  {
    description: "The root container that connects a React tree to a map engine adapter.",
    intro: "Map owns the engine instance, exposes controller APIs, and gives children a stable map context.",
    name: "Map",
    preview: "map",
    sections: [
      {
        body: "Use the same React component shape across Leaflet, MapLibre, Mapbox, and Google Maps. Swap the adapter when the project changes engines.",
        code: `import { Map, Marker } from "@map-kit/react";
import { leafletAdapter } from "@map-kit/leaflet";

export function FleetMap() {
  return (
    <Map adapter={leafletAdapter} center={[28.6139, 77.209]} zoom={10}>
      <Marker id="delhi" position={[28.6139, 77.209]} title="Delhi hub" />
    </Map>
  );
}`,
        id: "basic-usage",
        title: "Basic Usage",
      },
      {
        body: "For dashboards and tracking pages, keep viewport in your app state and react to map movement only when you need controlled behavior.",
        code: `<Map
  adapter={mapLibreAdapter}
  viewport={viewport}
  onViewportChange={setViewport}
  className="h-[420px] w-full"
/>`,
        id: "controlled-mode",
        title: "Controlled Mode",
      },
      {
        body: "Map Kit does not hide the engine. Reach for the adapter controller when a product workflow needs raw map access.",
        code: `const map = useMap();

map.fitBounds(bounds, { padding: 32, maxZoom: 14 });
map.flyTo({ center: vehicle.position, zoom: 12 });`,
        id: "engine-access",
        title: "Engine Access",
      },
    ],
    slug: "map",
  },
  {
    description: "Composable controls for zooming, fullscreen, reset, locate, and custom actions.",
    intro: "Controls sit on top of the map without forcing an engine-specific UI library.",
    name: "Controls",
    preview: "controls",
    sections: [
      {
        body: "Use the headless controls from @map-kit/react, or copy the shadcn-style control block into your app.",
        code: `<Map adapter={leafletAdapter} controls={{ zoom: false }}>
  <MapControls position="top-right" fullscreen reset={{ center, zoom: 10 }} />
</Map>`,
        id: "basic-usage",
        title: "Basic Usage",
      },
      {
        body: "The registry block is meant for teams that want ownership of the UI code and want it to match their app theme.",
        code: `pnpm dlx @map-kit/cli add map-controls --out src/components/map-kit`,
        id: "copy-paste-ui",
        title: "Copy-Paste UI",
      },
    ],
    slug: "controls",
  },
  {
    description: "Pins, badges, labels, and marker popups that work across supported engines.",
    intro: "Markers are data-driven and can render simple labels or fully custom React content.",
    name: "Markers",
    preview: "markers",
    sections: [
      {
        body: "Use a marker id and position for stable updates. This keeps vehicle and hub markers predictable during live updates.",
        code: `<Marker id="truck-277" position={[21.1702, 72.8311]} title="HR55AP0277">
  <MarkerBadge label="277" variant="badge" />
</Marker>`,
        id: "basic-usage",
        title: "Basic Usage",
      },
      {
        body: "Marker content stays in React, so tooltips, status chips, and click handlers can share your product components.",
        code: `<Marker id="stop-1" position={stop.position}>
  <PopupCard title="Stop 1" description="25m rest duration" />
</Marker>`,
        id: "custom-content",
        title: "Custom Content",
      },
    ],
    slug: "markers",
  },
  {
    description: "Popup and tooltip primitives for contextual map information.",
    intro: "Use compact surfaces for map points, route steps, geofence details, and operational status.",
    name: "Popups",
    preview: "popups",
    sections: [
      {
        body: "Popups can be engine-backed or copied as UI cards when you need full design control.",
        code: `<Popup position={[19.076, 72.8777]}>
  <PopupCard title="Mumbai hub" description="12 active vehicles" />
</Popup>`,
        id: "popup-cards",
        title: "Popup Cards",
      },
      {
        body: "Tooltips are best for lightweight labels that should not steal focus from map interaction.",
        code: `<Tooltip position={vehicle.position}>Moving at 42 km/h</Tooltip>`,
        id: "tooltips",
        title: "Tooltips",
      },
    ],
    slug: "popups",
  },
  {
    description: "Routes, polylines, fit bounds, progress paths, and geofence overlays.",
    intro: "Route primitives are built for logistics, dispatch, tracking, and playback experiences.",
    name: "Routes",
    preview: "routes",
    sections: [
      {
        body: "Render suggested and actual traversed paths with shared coordinates while preserving engine-specific performance.",
        code: `<Route id="actual" coordinates={actualPath} color="#2563eb" width={5} />
<Route id="remaining" coordinates={remainingPath} color="#9ca3af" width={4} dashed />`,
        id: "route-lines",
        title: "Route Lines",
      },
      {
        body: "Fit route bounds after data loads. The controller guards invalid coordinates before calling the underlying engine.",
        code: `<FitBounds bounds={routeBounds} padding={48} maxZoom={13} />`,
        id: "fit-bounds",
        title: "Fit Bounds",
      },
    ],
    slug: "routes",
  },
  {
    description: "Advanced adapter access for custom layers, engine-specific APIs, and mixed map stacks.",
    intro: "Map Kit gives a friendly surface first, then lets senior teams drop down when the product needs it.",
    name: "Advanced",
    preview: "advanced",
    sections: [
      {
        body: "Choose the adapter at runtime when a product supports multiple map providers.",
        code: `const adapter = engine === "google-maps" ? googleMapsAdapter : mapLibreAdapter;

<Map adapter={adapter} center={center} zoom={zoom} />`,
        id: "adapter-switching",
        title: "Adapter Switching",
      },
      {
        body: "Use engine refs for custom layers, vector sources, or provider-only APIs while keeping normal map UI in React.",
        code: `const { getEngineInstance } = useMap();
const nativeMap = getEngineInstance();

// Add provider-specific layers here.`,
        id: "raw-engine-access",
        title: "Raw Engine Access",
      },
    ],
    slug: "advanced",
  },
];

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}

export function getComponentGuide(slug: string) {
  return componentGuides.find((component) => component.slug === slug);
}
