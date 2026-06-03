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
  fitBounds?(bounds: LatLngBounds, options?: FitBoundsOptions): void;
  panTo?(center: LatLng, options?: CameraOptions): void;
  resize?(): void;
  getNativeMap?(): unknown;
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
      if (viewStore.fitBounds) {
        viewStore.fitBounds(bounds, options);
        return;
      }

      viewStore.setView(getBoundsCenter(bounds), options?.maxZoom);
    },
    panTo(center: LatLng, options?: CameraOptions) {
      if (viewStore.panTo) {
        viewStore.panTo(center, options);
        return;
      }

      viewStore.setView(center);
    },
    resize() {
      viewStore.resize?.();
    },
    getNativeMap() {
      return viewStore.getNativeMap?.();
    },
  };
}
