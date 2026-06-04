export type RegistryFile = {
  content: string;
  path: string;
  type: "registry:component" | "registry:lib";
};

export type RegistryItem = {
  category: "control" | "marker" | "overlay" | "utility";
  dependencies?: string[];
  description: string;
  files: RegistryFile[];
  name: string;
  preview?: {
    component: string;
    tags: string[];
  };
  registryDependencies?: string[];
  title: string;
  version: string;
};

export type RegistryIndex = {
  items: Array<Omit<RegistryItem, "files"> & { files: Array<Omit<RegistryFile, "content">> }>;
  name: string;
  schemaVersion: string;
};

const utilsSource = `export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}
`;

const mapControlButtonSource = `import type { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

export type MapControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function MapControlButton({
  active,
  className,
  type = "button",
  ...props
}: MapControlButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active && "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
        className,
      )}
      {...props}
    />
  );
}
`;

const mapControlsSource = `import { MapControls as HeadlessMapControls, type MapControlsProps } from "@map-kit/react";
import { cn } from "./utils";

export type StyledMapControlsProps = MapControlsProps & {
  compact?: boolean;
};

export function MapControls({ className, compact, buttonClassName, ...props }: StyledMapControlsProps) {
  return (
    <HeadlessMapControls
      unstyled
      className={cn(
        "rounded-lg border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80",
        compact ? "gap-1" : "gap-1.5",
        className,
      )}
      buttonClassName={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent bg-white px-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonClassName,
      )}
      {...props}
    />
  );
}
`;

const markerBadgeSource = `import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type MarkerBadgeVariant = "pin" | "dot" | "badge";
export type MarkerBadgeSize = "sm" | "md" | "lg";

export type MarkerBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: string;
  label?: string;
  size?: MarkerBadgeSize;
  variant?: MarkerBadgeVariant;
};

const sizeClass: Record<MarkerBadgeSize, string> = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-xs",
  lg: "h-8 w-8 text-sm",
};

export function MarkerBadge({
  className,
  color = "#2563eb",
  label,
  size = "md",
  style,
  variant = "pin",
  ...props
}: MarkerBadgeProps) {
  const isPin = variant === "pin";

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center border-[3px] border-white font-bold text-white shadow-lg",
        sizeClass[size],
        variant === "badge" ? "rounded-full" : "rounded-full rounded-bl-sm",
        isPin && "-rotate-45",
        className,
      )}
      style={{ backgroundColor: color, ...style }}
      {...props}
    >
      {label ? (
        <span className={cn("leading-none", isPin && "rotate-45")}>{label.slice(0, 3)}</span>
      ) : (
        <span className="h-2 w-2 rounded-full bg-white" />
      )}
    </span>
  );
}
`;

const popupCardSource = `import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export type PopupCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
};

export function PopupCard({ children, className, description, footer, title, ...props }: PopupCardProps) {
  return (
    <div
      className={cn(
        "min-w-56 rounded-lg border border-slate-200 bg-white p-3 text-slate-900 shadow-xl",
        className,
      )}
      {...props}
    >
      {title ? <div className="text-sm font-semibold leading-5 text-slate-950">{title}</div> : null}
      {description ? <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div> : null}
      {children ? <div className="mt-3 text-sm leading-5 text-slate-700">{children}</div> : null}
      {footer ? <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div> : null}
    </div>
  );
}
`;

const mapLegendSource = `import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export type MapLegendItem = {
  label: ReactNode;
  color?: string;
  dashed?: boolean;
};

export type MapLegendProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  items: MapLegendItem[];
};

export function MapLegend({ className, items, title = "Map legend", ...props }: MapLegendProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white/95 p-3 text-sm text-slate-700 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80",
        className,
      )}
      {...props}
    >
      {title ? <div className="mb-2 font-semibold text-slate-950">{title}</div> : null}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div className="flex items-center gap-2" key={index}>
            <span
              className={cn("h-0.5 w-8 rounded-full", item.dashed && "border-t-2 border-dashed bg-transparent")}
              style={{
                backgroundColor: item.dashed ? undefined : item.color ?? "#2563eb",
                borderColor: item.color ?? "#2563eb",
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

export const registrySchemaVersion = "0.1.0";

export const registry: RegistryItem[] = [
  {
    category: "utility",
    description: "Tiny class name join helper used by the generated components.",
    files: [{ content: utilsSource, path: "utils.ts", type: "registry:lib" }],
    name: "utils",
    title: "Class name utility",
    version: "0.1.0",
  },
  {
    category: "control",
    dependencies: ["utils"],
    description: "A Tailwind-styled button for custom map toolbars.",
    files: [{ content: mapControlButtonSource, path: "map-control-button.tsx", type: "registry:component" }],
    name: "map-control-button",
    preview: { component: "MapControlButton", tags: ["toolbar", "button", "tailwind"] },
    title: "Map Control Button",
    version: "0.1.0",
  },
  {
    category: "control",
    dependencies: ["utils"],
    description: "Styled wrapper around @map-kit/react MapControls.",
    files: [{ content: mapControlsSource, path: "map-controls.tsx", type: "registry:component" }],
    name: "map-controls",
    preview: { component: "MapControls", tags: ["toolbar", "zoom", "fullscreen"] },
    registryDependencies: ["@map-kit/react"],
    title: "Map Controls",
    version: "0.1.0",
  },
  {
    category: "marker",
    dependencies: ["utils"],
    description: "Small pin, dot, or badge marker preview component.",
    files: [{ content: markerBadgeSource, path: "marker-badge.tsx", type: "registry:component" }],
    name: "marker-badge",
    preview: { component: "MarkerBadge", tags: ["marker", "pin", "badge"] },
    title: "Marker Badge",
    version: "0.1.0",
  },
  {
    category: "overlay",
    dependencies: ["utils"],
    description: "Compact popup content card for map overlays.",
    files: [{ content: popupCardSource, path: "popup-card.tsx", type: "registry:component" }],
    name: "popup-card",
    preview: { component: "PopupCard", tags: ["popup", "overlay", "card"] },
    title: "Popup Card",
    version: "0.1.0",
  },
  {
    category: "overlay",
    dependencies: ["utils"],
    description: "Route or layer legend card for map overlays.",
    files: [{ content: mapLegendSource, path: "map-legend.tsx", type: "registry:component" }],
    name: "map-legend",
    preview: { component: "MapLegend", tags: ["legend", "route", "overlay"] },
    title: "Map Legend",
    version: "0.1.0",
  },
];

export function createRegistryIndex(): RegistryIndex {
  return {
    items: registry.map(({ files, ...item }) => ({
      ...item,
      files: files.map(({ content: _content, ...file }) => file),
    })),
    name: "@map-kit/registry",
    schemaVersion: registrySchemaVersion,
  };
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registry.find((item) => item.name === name);
}
