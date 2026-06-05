"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import type { LatLng } from "@map-kit/core";
import { Map } from "@map-kit/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

const nyc: LatLng = [40.7128, -74.006];
const london: LatLng = [51.5074, -0.1276];

export function ControlledMapExample() {
  const provider = useShowcaseProvider();
  const [center, setCenter] = useState<LatLng>(nyc);

  return (
    <div className="relative h-full w-full">
      <Map
        adapter={mapLibreAdapter}
        center={center}
        className="h-full w-full"
        controls={showcaseControls}
        engine="maplibre"
        provider={provider}
        zoom={11}
      />
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <Button onClick={() => setCenter(nyc)} size="sm" type="button" variant="secondary">
          NYC
        </Button>
        <Button onClick={() => setCenter(london)} size="sm" type="button" variant="secondary">
          London
        </Button>
      </div>
    </div>
  );
}
