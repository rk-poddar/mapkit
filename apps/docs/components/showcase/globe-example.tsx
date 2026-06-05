"use client";

import type { MapController } from "@map-kit/core";
import { Navigation } from "lucide-react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

const destination = {
  center: [40.7128, -74.006] as const,
  description: "United States",
  name: "New York",
  startCenter: [50, 10] as const,
  zoom: 14,
};

export function GlobeExample() {
  const controllerRef = useRef<MapController | null>(null);

  const handleReady = (controller: MapController) => {
    controllerRef.current = controller;
  };

  const handleFly = () => {
    const nativeMap = controllerRef.current?.getNativeMap?.() as MapLibreMap | undefined;
    if (!nativeMap) {
      return;
    }

    nativeMap.flyTo({
      center: [destination.center[1], destination.center[0]],
      duration: 2500,
      zoom: destination.zoom,
    });
  };

  return (
    <ExampleCard className="aspect-square" stagger={6}>
      <ShowcaseMap
        center={destination.startCenter}
        globe
        onReady={handleReady}
        showFlyButton={false}
        zoom={0.6}
      >
        <HtmlMarker position={destination.center}>
          <div className="relative flex items-center justify-center">
            <div className="absolute size-6 animate-ping rounded-full bg-cyan-500/20" />
            <div className="size-4 rounded-full border-2 border-white bg-cyan-500 shadow-lg" />
          </div>
        </HtmlMarker>
      </ShowcaseMap>

      <Button
        aria-label="Fly to destination"
        className="absolute top-2 right-2 z-20"
        onClick={handleFly}
        size="icon-sm"
        type="button"
        variant="secondary"
      >
        <Navigation className="size-4" />
      </Button>
    </ExampleCard>
  );
}
