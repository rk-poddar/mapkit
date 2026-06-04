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

export function getComponentDoc(slug: string) {
  return componentDocs.find((component) => component.slug === slug);
}
