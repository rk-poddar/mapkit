"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Map, MapControls } from "@map-kit/react";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

const center = [40.7128, -74.006] as const;

export function ControlsExample() {
  const provider = useShowcaseProvider();

  return (
    <Map
      adapter={mapLibreAdapter}
      center={center}
      className="h-full w-full"
      controls={{ ...showcaseControls, zoom: false }}
      engine="maplibre"
      provider={provider}
      zoom={11}
    >
      <MapControls fullscreen position="top-right" reset={{ center, zoom: 11 }} />
    </Map>
  );
}
