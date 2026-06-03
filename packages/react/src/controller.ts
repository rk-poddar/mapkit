import { getBoundsCenter } from "@map-kit/core";
import type {
  CameraOptions,
  FitBoundsOptions,
  LatLng,
  LatLngBounds,
  MapController,
  MapEngine,
} from "@map-kit/core";

export type ViewStateStore = {
  getCenter(): LatLng;
  getZoom(): number;
  setView(center: LatLng, zoom?: number): void;
};

export function createFallbackMapController(
  engine: MapEngine,
  viewStore: ViewStateStore,
): MapController {
  return {
    engine,
    getCenter: viewStore.getCenter,
    getZoom: viewStore.getZoom,
    setView(center: LatLng, zoom?: number, _options?: CameraOptions) {
      viewStore.setView(center, zoom);
    },
    fitBounds(bounds: LatLngBounds, options?: FitBoundsOptions) {
      viewStore.setView(getBoundsCenter(bounds), options?.maxZoom);
    },
    panTo(center: LatLng, _options?: CameraOptions) {
      viewStore.setView(center);
    },
    resize() {
      // Native adapters replace this no-op with engine-specific resize behavior.
    },
    getNativeMap() {
      return undefined;
    },
  };
}
