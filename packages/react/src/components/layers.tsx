import { useEffect, useMemo, useRef } from "react";
import { useMapContext } from "../map-context";
import type { MarkerModel } from "@map-kit/core";
import type {
  CircleProps,
  MapLayerState,
  MarkerProps,
  PopupProps,
  PolygonProps,
  RouteProps,
  TooltipProps,
} from "../types";

const POPUP_TEXT_SEPARATOR = "\n";
const POPUP_COMPONENT_NAME = "Popup";
const TOOLTIP_COMPONENT_NAME = "Tooltip";

export function Marker({ children, ...model }: MarkerProps) {
  const popup = extractChildText(children, POPUP_COMPONENT_NAME);
  const tooltip = extractChildText(children, TOOLTIP_COMPONENT_NAME);
  const popupOptions = extractPopupOptions(children);
  const layer = useMemo<MapLayerState>(
    () => ({
      kind: "marker",
      model: {
        ...model,
        popup: popup ?? model.popup,
        popupOptions: popupOptions ?? model.popupOptions,
        tooltip: tooltip ?? model.tooltip,
      },
    }),
    [model, popup, popupOptions, tooltip],
  );
  useLayer(layer);

  return null;
}

export function Popup(_props: PopupProps) {
  return null;
}
Popup.displayName = POPUP_COMPONENT_NAME;

export function Tooltip(_props: TooltipProps) {
  return null;
}
Tooltip.displayName = TOOLTIP_COMPONENT_NAME;

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

function extractChildText(
  children: MarkerProps["children"],
  componentName: string,
): string | undefined {
  if (children === null || children === undefined || typeof children === "boolean") {
    return undefined;
  }

  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children
      .map((child) => extractChildText(child, componentName))
      .filter(Boolean)
      .join(POPUP_TEXT_SEPARATOR);
  }

  if (typeof children === "object" && "props" in children && "type" in children) {
    const childType = children.type as { displayName?: string; name?: string };
    if (childType.displayName !== componentName && childType.name !== componentName) {
      return undefined;
    }

    const props = children.props as { children?: MarkerProps["children"] };
    return extractChildText(props.children, componentName);
  }

  return undefined;
}

function extractPopupOptions(children: MarkerProps["children"]): MarkerModel["popupOptions"] {
  if (children === null || children === undefined || typeof children !== "object") {
    return undefined;
  }

  if (Array.isArray(children)) {
    for (const child of children) {
      const options = extractPopupOptions(child);
      if (options) {
        return options;
      }
    }

    return undefined;
  }

  if ("props" in children && "type" in children) {
    const childType = children.type as { displayName?: string; name?: string };
    if (childType.displayName !== POPUP_COMPONENT_NAME && childType.name !== POPUP_COMPONENT_NAME) {
      return undefined;
    }

    const props = children.props as PopupProps;
    return {
      closeButton: props.closeButton,
      maxWidth: props.maxWidth,
    };
  }

  return undefined;
}
