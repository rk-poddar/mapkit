import { useEffect } from "react";
import { useMap } from "../map-context";
import type { FitBoundsProps } from "../types";

export function FitBounds({ bounds, options, when = true }: FitBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (!when) {
      return;
    }

    map.fitBounds(bounds, options);
  }, [bounds, map, options, when]);

  return null;
}
