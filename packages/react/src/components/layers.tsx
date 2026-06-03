import { useEffect, useMemo } from "react";
import { useMapContext } from "../map-context";
import type {
  CircleProps,
  MapLayerState,
  MarkerProps,
  PolygonProps,
  RouteProps,
} from "../types";

export function Marker({ children: _children, ...model }: MarkerProps) {
  const layer = useMemo<MapLayerState>(() => ({ kind: "marker", model }), [model]);
  useLayer(layer);

  return null;
}

export function Route(props: RouteProps) {
  const layer = useMemo<MapLayerState>(() => ({ kind: "route", model: props }), [props]);
  useLayer(layer);

  return null;
}

export function Circle(props: CircleProps) {
  const layer = useMemo<MapLayerState>(() => ({ kind: "circle", model: props }), [props]);
  useLayer(layer);

  return null;
}

export function Polygon(props: PolygonProps) {
  const layer = useMemo<MapLayerState>(() => ({ kind: "polygon", model: props }), [props]);
  useLayer(layer);

  return null;
}

function useLayer(layer: MapLayerState) {
  const { registerLayer, updateLayer, removeLayer } = useMapContext();
  const layerId = layer.model.id;

  useEffect(() => {
    registerLayer(layer);

    return () => {
      removeLayer(layerId);
    };
  }, [layer, layerId, registerLayer, removeLayer]);

  useEffect(() => {
    updateLayer(layer);
  }, [layer, updateLayer]);
}
