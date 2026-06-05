"use client";

import { Flame } from "lucide-react";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

const hotspots = [
  {
    glowClass: "size-18 bg-orange-500/30",
    gradientClass: "from-orange-500 to-red-500 shadow-orange-500/50",
    iconClass: "size-3.5",
    innerGlowClass: "size-7 bg-orange-500/40",
    label: "Times Square",
    lat: 40.7484,
    lng: -73.9857,
  },
  {
    glowClass: "size-14 bg-rose-500/30",
    gradientClass: "from-rose-500 to-pink-500 shadow-rose-500/50",
    iconClass: "size-3",
    innerGlowClass: "",
    label: "Central Park",
    lat: 40.7829,
    lng: -73.9654,
  },
  {
    glowClass: "size-12 bg-amber-500/30",
    gradientClass: "from-amber-500 to-yellow-500 shadow-amber-500/50",
    iconClass: "size-2.5",
    innerGlowClass: "",
    label: "Statue of Liberty",
    lat: 40.6892,
    lng: -74.0445,
  },
] as const;

export function TrendingExample() {
  return (
    <ExampleCard className="aspect-square" stagger={8}>
      <ShowcaseMap center={[40.735, -73.99]} zoom={10}>
        {hotspots.map((spot) => (
          <HtmlMarker key={spot.label} position={[spot.lat, spot.lng]}>
            <div className="relative flex items-center justify-center">
              <div className={`pointer-events-none absolute rounded-full ${spot.glowClass}`} />
              {spot.innerGlowClass ? (
                <div className={`absolute rounded-full ${spot.innerGlowClass}`} />
              ) : null}
              <div className={`rounded-full bg-gradient-to-br p-1.5 shadow-lg ${spot.gradientClass}`}>
                <Flame className={`text-white ${spot.iconClass}`} />
              </div>
            </div>
          </HtmlMarker>
        ))}
      </ShowcaseMap>
    </ExampleCard>
  );
}
