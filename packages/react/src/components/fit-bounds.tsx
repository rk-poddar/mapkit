import { useEffect } from "react";
import { useMap, useMapReady } from "../map-context";
import type { FitBoundsProps } from "../types";

export function FitBounds({ bounds, options, when = true }: FitBoundsProps) {
  const map = useMap();
  const isReady = useMapReady();

  useEffect(() => {
    if (!when || !isReady) {
      return;
    }

    map.fitBounds(bounds, options);
  }, [bounds, isReady, map, options, when]);

  return null;
}
