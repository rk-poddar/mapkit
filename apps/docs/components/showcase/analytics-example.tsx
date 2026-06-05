"use client";

import { TrendingUp } from "lucide-react";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

const analyticsData = [
  { city: "New York", lat: 40.7128, lng: -74.006, users: 847, size: 14 },
  { city: "London", lat: 51.5074, lng: -0.1276, users: 623, size: 12 },
  { city: "Tokyo", lat: 35.6895, lng: 139.6917, users: 412, size: 10 },
  { city: "San Francisco", lat: 37.7749, lng: -122.4194, users: 298, size: 9 },
  { city: "Paris", lat: 48.8566, lng: 2.3522, users: 187, size: 8 },
  { city: "Delhi", lat: 28.6139, lng: 77.209, users: 156, size: 7 },
  { city: "Sydney", lat: -33.8688, lng: 151.2093, users: 134, size: 7 },
  { city: "Rio", lat: -22.9068, lng: -43.1729, users: 89, size: 6 },
  { city: "Amsterdam", lat: 52.3676, lng: 4.9041, users: 76, size: 5 },
  { city: "Seoul", lat: 37.5665, lng: 126.978, users: 45, size: 5 },
] as const;

export function AnalyticsExample() {
  return (
    <ExampleCard className="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto" stagger={4}>
      <div className="bg-background/95 border-border/50 absolute top-3 left-3 z-10 rounded-lg border p-3 shadow-lg backdrop-blur-md">
        <div className="text-muted-foreground mb-1 text-[10px] tracking-wider uppercase">Active Users</div>
        <div className="text-2xl leading-tight font-semibold">2,847</div>
        <div className="mt-1 flex items-center gap-1">
          <TrendingUp className="size-3 text-emerald-500" />
          <span className="text-xs text-emerald-500">+12.5%</span>
          <span className="text-muted-foreground text-xs">vs last hour</span>
        </div>
      </div>
      <ShowcaseMap center={[30, 0]} zoom={1.2}>
        {analyticsData.map((location) => (
          <HtmlMarker key={location.city} position={[location.lat, location.lng]}>
            <div className="relative flex items-center justify-center">
              <div
                className="absolute rounded-full bg-emerald-500/20"
                style={{ height: location.size * 2.5, width: location.size * 2.5 }}
              />
              <div
                className="absolute animate-ping rounded-full bg-emerald-500/40"
                style={{
                  animationDuration: "2s",
                  height: location.size * 1.5,
                  width: location.size * 1.5,
                }}
              />
              <div
                className="relative rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
                style={{ height: location.size, width: location.size }}
              />
            </div>
          </HtmlMarker>
        ))}
      </ShowcaseMap>
    </ExampleCard>
  );
}
