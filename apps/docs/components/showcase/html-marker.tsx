"use client";

import type { LatLng } from "@map-kit/core";
import { useMap, useMapReady } from "@map-kit/react";
import type { Marker as MapLibreMarker, Map as MapLibreMap } from "maplibre-gl";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

type HtmlMarkerProps = {
  anchor?: "center" | "bottom";
  children: ReactNode;
  position: LatLng;
};

export function HtmlMarker({ anchor = "center", children, position }: HtmlMarkerProps) {
  const map = useMap();
  const isReady = useMapReady();
  const markerId = useId();
  const markerRef = useRef<MapLibreMarker | null>(null);
  const rootRef = useRef<Root | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const nativeMap = map.getNativeMap?.() as MapLibreMap | undefined;
    if (!nativeMap) {
      return;
    }

    const element = document.createElement("div");
    element.dataset.markerId = markerId;
    elementRef.current = element;
    rootRef.current = createRoot(element);
    rootRef.current.render(children);

    let cancelled = false;

    void import("maplibre-gl").then(({ Marker }) => {
      if (cancelled) {
        return;
      }

      markerRef.current = new Marker({ anchor, element })
        .setLngLat([position[1], position[0]])
        .addTo(nativeMap);
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
      rootRef.current?.unmount();
      rootRef.current = null;
      elementRef.current = null;
    };
  }, [anchor, isReady, map, markerId, position]);

  useEffect(() => {
    rootRef.current?.render(children);
  }, [children]);

  useEffect(() => {
    markerRef.current?.setLngLat([position[1], position[0]]);
  }, [position]);

  return null;
}
