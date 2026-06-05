"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Circle, FitBounds, Map, MapControls, Marker, Popup, Route, Tooltip } from "@map-kit/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

const delhi = [28.6139, 77.209] as const;
const jaipur = [26.9124, 75.7873] as const;
const agra = [27.1767, 78.0081] as const;
const gurugram = [28.4595, 77.0266] as const;

const primaryRoute = [jaipur, gurugram, delhi, agra];
const fastRoute = [jaipur, delhi, agra];

export function MapPreview() {
  const provider = useShowcaseProvider();
  const [showRadius, setShowRadius] = useState(true);
  const [routeMode, setRouteMode] = useState<"planned" | "actual">("actual");

  return (
    <section className="container space-y-5 py-20" id="preview">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Live preview</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">Declarative map UI with MapLibre GL.</h2>
        </div>
        <div aria-label="Preview controls" className="flex flex-wrap gap-2">
          <Button onClick={() => setRouteMode("actual")} type="button" variant={routeMode === "actual" ? "default" : "outline"}>
            Actual
          </Button>
          <Button onClick={() => setRouteMode("planned")} type="button" variant={routeMode === "planned" ? "default" : "outline"}>
            Planned
          </Button>
          <Button onClick={() => setShowRadius((value) => !value)} type="button" variant="outline">
            {showRadius ? "Hide" : "Show"} radius
          </Button>
        </div>
      </div>
      <Card className="relative overflow-hidden p-3">
        <Map
          adapter={mapLibreAdapter}
          center={delhi}
          className="h-[520px] min-h-[520px] w-full overflow-hidden rounded-lg"
          controls={showcaseControls}
          engine="maplibre"
          provider={provider}
          zoom={6}
        >
          <MapControls fullscreen position="top-right" reset={{ center: delhi, zoom: 6 }} />
          <FitBounds bounds={[jaipur, agra]} options={{ padding: 52 }} />
          <Route
            color={routeMode === "actual" ? "#3b82f6" : "#64748b"}
            coordinates={routeMode === "actual" ? primaryRoute : fastRoute}
            id="docs-route"
            width={4}
          />
          {showRadius ? (
            <Circle
              center={delhi}
              color="#0f766e"
              fillColor="#14b8a6"
              fillOpacity={0.16}
              id="docs-service-radius"
              radius={52000}
            />
          ) : null}
          <Marker color="#3b82f6" id="delhi" label="DL" position={delhi} title="Delhi hub" variant="badge">
            <Popup maxWidth={260}>Central hub with popup and tooltip primitives.</Popup>
            <Tooltip>Delhi hub</Tooltip>
          </Marker>
          <Marker color="#f97316" id="jaipur" label="JP" position={jaipur} title="Jaipur pickup" variant="pin" />
          <Marker color="#ef4444" id="agra" label="AG" position={agra} title="Agra drop" variant="dot" />
        </Map>
        <div
          aria-label="Map legend"
          className="absolute bottom-6 left-6 grid gap-2 rounded-lg border bg-background/95 p-3 text-sm shadow-lg backdrop-blur"
        >
          <LegendItem className="bg-blue-500" label="Actual route" />
          <LegendItem className="bg-neutral-500" label="Planned route" />
          <span className="text-muted-foreground flex items-center gap-2">
            <i className="size-3 rounded-full border border-teal-700 bg-teal-500/20" />
            Service radius
          </span>
        </div>
      </Card>
    </section>
  );
}

function LegendItem({ className, label }: { className: string; label: string }) {
  return (
    <span className="text-muted-foreground flex items-center gap-2">
      <i className={cn("h-0.5 w-8 rounded-full", className)} />
      {label}
    </span>
  );
}
