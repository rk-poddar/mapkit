#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

type RegistryItem = {
  dependencies?: string[];
  description: string;
  fileName: string;
  name: string;
  source: string;
};

export type AddOptions = {
  cwd?: string;
  dryRun?: boolean;
  force?: boolean;
  outDir?: string;
};

export type AddResult = {
  skipped: string[];
  written: string[];
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

export const registry: RegistryItem[] = [
  {
    description: "Tiny class name join helper used by the generated components.",
    fileName: "utils.ts",
    name: "utils",
    source: utilsSource,
  },
  {
    dependencies: ["utils"],
    description: "A Tailwind-styled button for custom map toolbars.",
    fileName: "map-control-button.tsx",
    name: "map-control-button",
    source: mapControlButtonSource,
  },
  {
    dependencies: ["utils"],
    description: "Styled wrapper around @map-kit/react MapControls.",
    fileName: "map-controls.tsx",
    name: "map-controls",
    source: mapControlsSource,
  },
  {
    dependencies: ["utils"],
    description: "Small pin, dot, or badge marker preview component.",
    fileName: "marker-badge.tsx",
    name: "marker-badge",
    source: markerBadgeSource,
  },
  {
    dependencies: ["utils"],
    description: "Compact popup content card for map overlays.",
    fileName: "popup-card.tsx",
    name: "popup-card",
    source: popupCardSource,
  },
  {
    dependencies: ["utils"],
    description: "Route or layer legend card for map overlays.",
    fileName: "map-legend.tsx",
    name: "map-legend",
    source: mapLegendSource,
  },
];

const registryByName = new Map(registry.map((item) => [item.name, item]));

export function listRegistry(): RegistryItem[] {
  return registry;
}

export function resolveRegistryItems(names: string[]): RegistryItem[] {
  const queue = names.length > 0 ? names : registry.filter((item) => item.name !== "utils").map((item) => item.name);
  const resolved = new Map<string, RegistryItem>();

  function visit(name: string) {
    const item = registryByName.get(name);
    if (!item) {
      throw new Error(`Unknown component "${name}". Run "map-kit list" to see available components.`);
    }

    for (const dependency of item.dependencies ?? []) {
      visit(dependency);
    }

    resolved.set(item.name, item);
  }

  for (const name of queue) {
    visit(name);
  }

  return Array.from(resolved.values());
}

export function addComponents(names: string[], options: AddOptions = {}): AddResult {
  const cwd = path.resolve(options.cwd ?? process.cwd());
  const outDir = path.resolve(cwd, options.outDir ?? "components/map-kit");
  const items = resolveRegistryItems(names);
  const result: AddResult = { skipped: [], written: [] };

  if (!options.dryRun) {
    mkdirSync(outDir, { recursive: true });
  }

  for (const item of items) {
    const target = path.join(outDir, item.fileName);

    if (existsSync(target) && !options.force) {
      result.skipped.push(path.relative(cwd, target));
      continue;
    }

    result.written.push(path.relative(cwd, target));

    if (!options.dryRun) {
      writeFileSync(target, item.source, "utf8");
    }
  }

  return result;
}

function printHelp() {
  console.log(`Map Kit CLI

Usage:
  map-kit list
  map-kit add [components...] [--out components/map-kit] [--force] [--dry-run]

Examples:
  map-kit add map-controls popup-card
  map-kit add --out src/components/map-kit
  map-kit add marker-badge --force
`);
}

function parseAddOptions(args: string[]): { names: string[]; options: AddOptions } {
  const names: string[] = [];
  const options: AddOptions = {};

  for (let index = 0; index < args.length; index += 1) {
    const value = args[index];

    if (value === "--force") {
      options.force = true;
    } else if (value === "--dry-run") {
      options.dryRun = true;
    } else if (value === "--cwd") {
      const cwd = args[++index];
      if (!cwd) {
        throw new Error('Missing value for "--cwd".');
      }
      options.cwd = cwd;
    } else if (value === "--out") {
      const outDir = args[++index];
      if (!outDir) {
        throw new Error('Missing value for "--out".');
      }
      options.outDir = outDir;
    } else if (value.startsWith("--")) {
      throw new Error(`Unknown option "${value}".`);
    } else {
      names.push(value);
    }
  }

  return { names, options };
}

export function runCli(argv = process.argv.slice(2)): number {
  const [command, ...args] = argv;

  try {
    if (!command || command === "--help" || command === "-h") {
      printHelp();
      return 0;
    }

    if (command === "list") {
      for (const item of registry.filter((entry) => entry.name !== "utils")) {
        console.log(`${item.name.padEnd(18)} ${item.description}`);
      }
      return 0;
    }

    if (command === "add") {
      const { names, options } = parseAddOptions(args);
      const result = addComponents(names, options);

      for (const file of result.written) {
        console.log(`${options.dryRun ? "would create" : "created"} ${file}`);
      }

      for (const file of result.skipped) {
        console.log(`skipped ${file} (already exists)`);
      }

      return 0;
    }

    throw new Error(`Unknown command "${command}".`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    return 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = runCli();
}
