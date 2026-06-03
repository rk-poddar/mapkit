import { useEffect, useMemo, useRef } from "react";
import { useMapContext } from "../map-context";
import type {
  CircleProps,
  MapLayerState,
  MarkerProps,
  PopupProps,
  PolygonProps,
  RouteProps,
} from "../types";

const POPUP_TEXT_SEPARATOR = "\n";
const POPUP_COMPONENT_NAME = "Popup";

export function Marker({ children, ...model }: MarkerProps) {
  const popup = extractPopupText(children);
  const layer = useMemo<MapLayerState>(
    () => ({
      kind: "marker",
      model: {
        ...model,
        popup: popup ?? model.popup,
      },
    }),
    [model, popup],
  );
  useLayer(layer);

  return null;
}

export function Popup(_props: PopupProps) {
  return null;
}
Popup.displayName = POPUP_COMPONENT_NAME;

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
  const layerRef = useRef(layer);
  const layerSignature = useMemo(() => JSON.stringify(layer), [layer]);

  layerRef.current = layer;

  useEffect(() => {
    registerLayer(layerRef.current);

    return () => {
      removeLayer(layerId);
    };
  }, [layerId, registerLayer, removeLayer]);

  useEffect(() => {
    updateLayer(layerRef.current);
  }, [layerSignature, updateLayer]);
}

function extractPopupText(children: MarkerProps["children"]): string | undefined {
  if (children === null || children === undefined || typeof children === "boolean") {
    return undefined;
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(extractPopupText).filter(Boolean).join(POPUP_TEXT_SEPARATOR);
  }

  if (typeof children === "object" && "props" in children && "type" in children) {
    const childType = children.type as { displayName?: string; name?: string };
    if (childType.displayName !== POPUP_COMPONENT_NAME && childType.name !== POPUP_COMPONENT_NAME) {
      return undefined;
    }

    const props = children.props as { children?: MarkerProps["children"] };
    return extractPopupText(props.children);
  }

  return undefined;
}
