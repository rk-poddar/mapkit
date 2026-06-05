"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Map, Route } from "@map-kit/react";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

const route = [
  [40.758, -73.9855],
  [40.7484, -73.9857],
  [40.7411, -73.9897],
  [40.7282, -73.9942],
] as const;

export function RoutesExample() {
  const provider = useShowcaseProvider();

  return (
    <Map
      adapter={mapLibreAdapter}
      center={[40.74, -73.99]}
      className="h-full w-full"
      controls={showcaseControls}
      engine="maplibre"
      provider={provider}
      zoom={12}
    >
      <Route color="#2563eb" coordinates={[...route]} id="docs-guide-route" width={4} />
    </Map>
  );
}
