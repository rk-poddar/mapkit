"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Map, Marker } from "@map-kit/react";
import { showcaseControls } from "@/lib/showcase-config";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";

export function MarkersExample() {
  const provider = useShowcaseProvider();

  return (
    <Map
      adapter={mapLibreAdapter}
      center={[40.7128, -74.006]}
      className="h-full w-full"
      controls={showcaseControls}
      engine="maplibre"
      provider={provider}
      zoom={11}
    >
      <Marker color="#3b82f6" id="nyc" label="NYC" position={[40.7128, -74.006]} title="New York" variant="badge" />
      <Marker color="#f97316" id="brooklyn" position={[40.6782, -73.9442]} title="Brooklyn" variant="pin" />
      <Marker color="#ef4444" id="jersey" position={[40.7178, -74.0431]} title="Jersey City" variant="dot" />
    </Map>
  );
}
