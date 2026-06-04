import type { HTMLAttributes, ReactNode } from "react";
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
