"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import type { LatLng, MapController } from "@map-kit/core";
import { Map } from "@map-kit/react";
import { Navigation } from "lucide-react";
import type { Map as MapLibreMap } from "maplibre-gl";
import { useTheme } from "next-themes";
import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useShowcaseProvider } from "@/lib/use-showcase-provider";
import { showcaseControls, showcaseDarkStyle, showcaseLightStyle } from "@/lib/showcase-config";
import { cn } from "@/lib/utils";
import { applyGlobeProjection } from "./globe-projection";
import { normalizeAttribution } from "./normalize-attribution";

type ShowcaseMapProps = {
  center: LatLng;
  children?: ReactNode;
  className?: string;
  engineOptions?: Record<string, unknown>;
  flyTarget?: { center: LatLng; zoom: number };
  globe?: boolean;
  onFly?: () => void;
  onReady?: (controller: MapController) => void;
  showFlyButton?: boolean;
  zoom: number;
};

export function ShowcaseMap({
  center,
  children,
  className,
  engineOptions,
  flyTarget,
  globe = false,
  onFly,
  onReady,
  showFlyButton = true,
  zoom,
}: ShowcaseMapProps) {
  const provider = useShowcaseProvider();
  const { resolvedTheme } = useTheme();
  const controllerRef = useRef<MapController | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const styleRef = useRef<string>(provider.styleUrl ?? showcaseLightStyle);

  const syncShowcaseStyle = (nativeMap: MapLibreMap) => {
    const nextStyle = resolvedTheme === "dark" ? showcaseDarkStyle : showcaseLightStyle;
    if (styleRef.current === nextStyle) {
      return;
    }

    styleRef.current = nextStyle;
    nativeMap.setStyle(nextStyle, { diff: true });
    nativeMap.once("style.load", () => normalizeAttribution(nativeMap));
  };

  useEffect(() => {
    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, []);

  useEffect(() => {
    const nativeMap = controllerRef.current?.getNativeMap?.() as MapLibreMap | undefined;
    if (!nativeMap) {
      return;
    }

    syncShowcaseStyle(nativeMap);

    if (!globe) {
      return;
    }

    nativeMap.once("styledata", () => applyGlobeProjection(nativeMap));
  }, [globe, resolvedTheme]);

  const handleReady = (controller: MapController) => {
    controllerRef.current = controller;

    const nativeMap = controller.getNativeMap?.() as MapLibreMap | undefined;
    if (!nativeMap) {
      onReady?.(controller);
      return;
    }

    const syncAttribution = () => normalizeAttribution(nativeMap);

    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = new ResizeObserver(syncAttribution);
    resizeObserverRef.current.observe(nativeMap.getContainer());

    requestAnimationFrame(syncAttribution);
    window.setTimeout(syncAttribution, 150);

    if (globe) {
      applyGlobeProjection(nativeMap);
    }

    onReady?.(controller);
  };

  const handleFly = () => {
    if (flyTarget) {
      const nativeMap = controllerRef.current?.getNativeMap?.() as MapLibreMap | undefined;
      if (nativeMap) {
        nativeMap.flyTo({
          center: [flyTarget.center[1], flyTarget.center[0]],
          duration: 2500,
          zoom: flyTarget.zoom,
        });
      } else {
        controllerRef.current?.setView(flyTarget.center, flyTarget.zoom);
      }
    }
    onFly?.();
  };

  const mapEngineOptions = {
    renderWorldCopies: false,
    ...(globe ? { maxPitch: 85 } : {}),
    ...engineOptions,
  };

  return (
    <>
      <Map
        adapter={mapLibreAdapter}
        center={center}
        className={cn("relative h-full w-full", className)}
        controls={showcaseControls}
        engine="maplibre"
        engineOptions={mapEngineOptions}
        onReady={handleReady}
        provider={provider}
        zoom={zoom}
      >
        {children}
      </Map>
      {flyTarget && showFlyButton ? (
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
      ) : null}
    </>
  );
}
