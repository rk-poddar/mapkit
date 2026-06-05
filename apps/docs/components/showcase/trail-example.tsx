"use client";

import { Route } from "@map-kit/react";
import { Bike, Clock, Flame, Route as RouteIcon } from "lucide-react";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

const trailCoordinates = [
  [40.80035246904919, -73.95846730810143],
  [40.78210942124929, -73.9717593682683],
  [40.76793032580281, -73.98192123136191],
  [40.76462909128966, -73.97393759456651],
  [40.765159628993814, -73.97291537521572],
  [40.7637106622374, -73.96920618484948],
  [40.77117117897504, -73.96383691302509],
  [40.76889223221369, -73.9584024523858],
  [40.784238113060894, -73.9470773638119],
  [40.78786547226602, -73.95585246901248],
  [40.79668351998197, -73.94937945594087],
  [40.797167598041455, -73.9498273526222],
  [40.80016017872583, -73.95699644240298],
] as const;

const start = trailCoordinates[0];
const end = trailCoordinates[trailCoordinates.length - 1];

export function TrailExample() {
  return (
    <ExampleCard className="aspect-square" stagger={5}>
      <div className="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center gap-1.5">
          <Bike className="size-3.5 text-emerald-500" />
          <span className="text-xs font-medium">Central Park Loop</span>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <Stat icon={RouteIcon} label="Miles" value="6.2" />
          <Stat icon={Clock} label="Mins" value="32" />
          <Stat icon={Flame} label="Cal" value="285" />
        </div>
      </div>
      <ShowcaseMap center={[40.782, -73.97]} zoom={11.8}>
        <Route color="#10b981" coordinates={[...trailCoordinates]} id="central-park-loop" opacity={0.9} width={3} />
        <HtmlMarker position={start}>
          <div className="size-3 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
        </HtmlMarker>
        <HtmlMarker position={end}>
          <div className="size-3 rounded-full border-2 border-white bg-red-500 shadow-lg" />
        </HtmlMarker>
      </ShowcaseMap>
    </ExampleCard>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof RouteIcon;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="text-muted-foreground mb-0.5 flex items-center justify-center">
        <Icon className="size-3" />
      </div>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-muted-foreground text-[9px] uppercase">{label}</div>
    </div>
  );
}
