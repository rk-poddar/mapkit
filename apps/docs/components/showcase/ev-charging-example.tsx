"use client";

import { Zap } from "lucide-react";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

type StationStatus = "available" | "in-use" | "offline";

const stations = [
  { detail: "50 kW · $0.28/kWh", lat: 37.7879, lng: -122.4074, name: "Union Square", status: "available" },
  { detail: "~15 min remaining", lat: 37.7625, lng: -122.435, name: "Castro Station", status: "in-use" },
  { detail: "", lat: 37.7759, lng: -122.4264, name: "Hayes Valley", status: "offline" },
  { detail: "350 kW · $0.40/kWh", lat: 37.7935, lng: -122.3934, name: "Embarcadero", status: "available" },
  { detail: "150 kW · $0.32/kWh", lat: 37.801, lng: -122.437, name: "Marina District", status: "available" },
  { detail: "50 kW · $0.30/kWh", lat: 37.778, lng: -122.401, name: "SoMa Charger", status: "available" },
  { detail: "150 kW · $0.33/kWh", lat: 37.75, lng: -122.431, name: "Noe Valley", status: "available" },
  { detail: "~8 min remaining", lat: 37.781, lng: -122.478, name: "Richmond Charger", status: "in-use" },
  { detail: "", lat: 37.76, lng: -122.401, name: "Potrero Hill", status: "offline" },
  { detail: "350 kW · $0.38/kWh", lat: 37.77, lng: -122.391, name: "Mission Bay", status: "available" },
  { detail: "150 kW · $0.34/kWh", lat: 37.77, lng: -122.466, name: "Golden Gate Park", status: "available" },
] as const;

const statusConfig: Record<StationStatus, { bg: string; label: string }> = {
  available: { bg: "bg-emerald-500", label: "Available" },
  "in-use": { bg: "bg-amber-500", label: "In Use" },
  offline: { bg: "bg-zinc-400", label: "Offline" },
};

export function EVChargingExample() {
  return (
    <ExampleCard className="aspect-square" stagger={7}>
      <ShowcaseMap center={[37.776, -122.434]} zoom={11}>
        {stations.map((station) => {
          const config = statusConfig[station.status];
          return (
            <HtmlMarker key={station.name} position={[station.lat, station.lng]}>
              <div className={`${config.bg} rounded-full p-1.5 shadow-lg`}>
                <Zap className="size-3 fill-white text-white" />
              </div>
            </HtmlMarker>
          );
        })}
      </ShowcaseMap>
    </ExampleCard>
  );
}
