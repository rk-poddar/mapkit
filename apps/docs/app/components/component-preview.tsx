import type { ComponentDoc } from "../docs-data";
import { Button } from "@/components/ui/button";

export function ComponentPreview({ component }: { component: ComponentDoc }) {
  return (
    <div className="bg-muted/40 grid h-full min-h-full w-full place-items-center p-6">
      {component.slug === "map-controls" ? (
        <div aria-label="Map controls preview" className="rounded-lg border bg-card p-1.5 shadow-lg">
          <div className="flex flex-wrap gap-1.5">
            <Button size="icon" type="button" variant="ghost">
              +
            </Button>
            <Button size="icon" type="button" variant="ghost">
              -
            </Button>
            <Button type="button" variant="ghost">
              Reset
            </Button>
            <Button size="icon" type="button" variant="ghost">
              ⛶
            </Button>
          </div>
        </div>
      ) : null}
      {component.slug === "marker-badge" ? (
        <div aria-label="Marker badge preview" className="flex items-end gap-5">
          <span className="grid size-12 -rotate-45 place-items-center rounded-full rounded-bl-sm bg-blue-600 text-sm font-bold text-white shadow-lg">
            <span className="rotate-45">DL</span>
          </span>
          <span className="grid h-10 min-w-14 place-items-center rounded-full bg-emerald-500 px-3 text-sm font-bold text-white shadow-lg">
            GGN
          </span>
          <span className="size-4 rounded-full bg-red-500 ring-4 ring-red-500/20" />
        </div>
      ) : null}
      {component.slug === "popup-card" ? (
        <div className="min-w-56 rounded-lg border bg-card p-3 shadow-xl">
          <strong className="text-sm">Delhi hub</strong>
          <span className="text-muted-foreground mt-1 block text-xs">Primary NCR warehouse</span>
          <p className="mt-3 text-sm">18 vehicles assigned.</p>
        </div>
      ) : null}
      {component.slug === "map-legend" ? (
        <div className="grid gap-2 rounded-lg border bg-card/95 p-3 text-sm shadow-lg">
          <strong>Route legend</strong>
          <span className="text-muted-foreground flex items-center gap-2">
            <i className="h-0.5 w-8 rounded-full bg-blue-500" />
            Actual route
          </span>
          <span className="text-muted-foreground flex items-center gap-2">
            <i className="h-0.5 w-8 rounded-full bg-neutral-500" />
            Suggested route
          </span>
        </div>
      ) : null}
    </div>
  );
}
