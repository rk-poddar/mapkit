import type {
  AttributionOptions,
  CircleModel,
  CreateMapOptions,
  FitBoundsOptions,
  LatLng,
  LatLngBounds,
  MapAdapter,
  MapAdapterInstance,
  MapControlOptions,
  MapController,
  MapEngine,
  MapKitError,
  MapProvider,
  MarkerModel,
  PolygonModel,
  ProviderConfig,
  RouteModel,
} from "@map-kit/core";
import type { CSSProperties, ReactNode } from "react";

export type MapKitProviderInput = MapProvider | ProviderConfig;

export type MapProps = {
  engine: MapEngine;
  provider?: MapKitProviderInput;
  apiKey?: string;
  accessToken?: string;
  center?: LatLng;
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  bounds?: LatLngBounds;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  controls?: MapControlOptions;
  attribution?: AttributionOptions;
  adapter?: MapAdapter;
  engineOptions?: unknown;
  fallback?: ReactNode;
  onReady?: (map: MapController) => void;
  onError?: (error: MapKitError) => void;
  onMove?: CreateMapOptions["onMove"];
  onClick?: CreateMapOptions["onClick"];
};

export type MapLayerKind = "marker" | "route" | "circle" | "polygon";

export type MapLayerState =
  | { kind: "marker"; model: MarkerModel }
  | { kind: "route"; model: RouteModel }
  | { kind: "circle"; model: CircleModel }
  | { kind: "polygon"; model: PolygonModel };

export type MapLifecycleState = {
  engine: MapEngine;
  adapter?: MapAdapter;
  controller: MapController;
  instance?: MapAdapterInstance;
  container?: HTMLElement;
  isReady: boolean;
  error?: MapKitError;
};

export type MapContextValue = MapLifecycleState & {
  layers: ReadonlyMap<string, MapLayerState>;
  registerLayer(layer: MapLayerState): void;
  updateLayer(layer: MapLayerState): void;
  removeLayer(id: string): void;
  getLayer(id: string): MapLayerState | undefined;
};

export type MarkerProps = MarkerModel & {
  children?: ReactNode;
};

export type PopupProps = {
  children: ReactNode;
  maxWidth?: number;
  closeButton?: boolean;
};

export type TooltipProps = {
  children: ReactNode;
};

export type MapControlsPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type MapControlsProps = {
  position?: MapControlsPosition;
  zoom?: boolean;
  fullscreen?: boolean;
  reset?: boolean | {
    center: LatLng;
    zoom?: number;
  };
  className?: string;
  style?: CSSProperties;
  labels?: {
    zoomIn?: string;
    zoomOut?: string;
    reset?: string;
    fullscreen?: string;
  };
};

export type RouteProps = RouteModel;

export type CircleProps = CircleModel;

export type PolygonProps = PolygonModel;

export type FitBoundsProps = {
  bounds: LatLngBounds;
  options?: FitBoundsOptions;
  when?: boolean;
};
