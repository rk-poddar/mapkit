"use client";

import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

const CARTO_LIGHT = "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const CARTO_DARK = "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png";

export const mapPreviewControls = { attribution: false, zoom: false } as const;
export const mapPreviewAttribution = { visible: false } as const;

export function useMapLibreProvider() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return useMemo(
    () => ({
      attribution: "© OpenStreetMap contributors © CARTO",
      maxZoom: 20,
      provider: "custom" as const,
      tileUrl: mounted && resolvedTheme === "dark" ? CARTO_DARK : CARTO_LIGHT,
    }),
    [mounted, resolvedTheme],
  );
}
