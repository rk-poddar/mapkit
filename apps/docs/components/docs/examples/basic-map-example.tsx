"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Map } from "@map-kit/react";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

export function BasicMapExample() {
  const provider = useShowcaseProvider();

  return (
    <Map
      adapter={mapLibreAdapter}
      center={[40.7128, -74.006]}
      className="h-full w-full"
      controls={showcaseControls}
      engine="maplibre"
      provider={provider}
      zoom={12}
    />
  );
}
