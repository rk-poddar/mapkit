import type {
  CircleModel,
  CreateMapOptions,
  FitBoundsOptions,
  LatLng,
  LatLngBounds,
  MapAdapter,
  MapAdapterInstance,
  MapLayerHandle,
  MarkerModel,
  PolygonModel,
  RouteModel,
} from "@map-kit/core";
import { googleMapsCapabilities } from "./capabilities";
import { loadGoogleMaps } from "./loader";
import { resolveGoogleMapId, resolveGoogleMapsProvider } from "./provider";

type GoogleMapsAdapterInstance = MapAdapterInstance & {
  maps?: typeof google.maps;
};

type GoogleMapsMarkerHandle = {
  kind: "marker";
  marker: google.maps.Marker;
  infoWindow?: google.maps.InfoWindow;
};

type GoogleMapsOverlayHandle = {
  kind: "overlay";
  overlay: google.maps.Polyline | google.maps.Circle | google.maps.Polygon;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function assertFinitePosition(position: LatLng, label: string): void {
  if (!isFiniteNumber(position[0]) || !isFiniteNumber(position[1])) {
    throw new Error(`Invalid ${label}: expected finite [lat, lng] coordinates.`);
  }
}

function toGoogleLatLngLiteral(position: LatLng): google.maps.LatLngLiteral {
  assertFinitePosition(position, "position");

  return {
    lat: position[0],
    lng: position[1],
  };
}

function toGoogleBounds(maps: typeof google.maps, bounds: LatLngBounds): google.maps.LatLngBounds {
  const [first, second] = bounds;
  assertFinitePosition(first, "bounds[0]");
  assertFinitePosition(second, "bounds[1]");

  const googleBounds = new maps.LatLngBounds();
  googleBounds.extend(toGoogleLatLngLiteral(first));
  googleBounds.extend(toGoogleLatLngLiteral(second));

  return googleBounds;
}

function toGooglePadding(options?: FitBoundsOptions): number | google.maps.Padding | undefined {
  const padding = options?.padding;

  if (typeof padding === "number") {
    return isFiniteNumber(padding) ? padding : 0;
  }

  if (!padding) {
    return undefined;
  }

  return {
    top: isFiniteNumber(padding.top) ? padding.top : 0,
    right: isFiniteNumber(padding.right) ? padding.right : 0,
    bottom: isFiniteNumber(padding.bottom) ? padding.bottom : 0,
    left: isFiniteNumber(padding.left) ? padding.left : 0,
  };
}

function getMap(instance: MapAdapterInstance): google.maps.Map {
  return instance.nativeMap as google.maps.Map;
}

function getMaps(instance: MapAdapterInstance): typeof google.maps {
  const maps = (instance as GoogleMapsAdapterInstance).maps ?? globalThis.google?.maps;

  if (!maps) {
    throw new Error("Google Maps module is not available for this map instance.");
  }

  return maps;
}

function createMarkerSvg(color: string, marker: MarkerModel): string {
  const label = marker.label?.slice(0, 3);
  const isBadge = marker.variant === "badge" || marker.variant === "dot";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">`,
    isBadge
      ? `<circle cx="12" cy="12" r="10.5" fill="${color}" stroke="white" stroke-width="3"/>`
      : `<path fill="${color}" stroke="white" stroke-width="3" d="M12 1.5c5.8 0 10.5 4.7 10.5 10.5 0 7.9-10.5 16.5-10.5 16.5S1.5 19.9 1.5 12C1.5 6.2 6.2 1.5 12 1.5Z"/>`,
    label
      ? `<text x="12" y="15" text-anchor="middle" font-size="9" font-weight="700" font-family="Arial,sans-serif" fill="white">${label}</text>`
      : `<circle cx="12" cy="12" r="4" fill="white"/>`,
    `</svg>`,
  ].join("");
}

function createMarkerIcon(
  maps: typeof google.maps,
  marker: MarkerModel,
): google.maps.Icon {
  const color = marker.color ?? "#2563eb";
  const scale = marker.size === "sm" ? 0.82 : marker.size === "lg" ? 1.2 : 1;
  const width = Math.round(24 * scale);
  const height = Math.round(30 * scale);

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createMarkerSvg(color, marker))}`,
    scaledSize: new maps.Size(width, height),
    anchor: new maps.Point(width / 2, marker.variant === "badge" || marker.variant === "dot" ? height / 2 : height),
  };
}

function getMarkerPopupContent(marker: MarkerModel): string | undefined {
  return [marker.title, marker.description, marker.popup].filter(Boolean).join("<br />");
}

function createHandle(
  id: string,
  nativeLayer: GoogleMapsMarkerHandle | GoogleMapsOverlayHandle,
): MapLayerHandle {
  return {
    id,
    nativeLayer,
    dispose: () => {
      if (nativeLayer.kind === "marker") {
        nativeLayer.infoWindow?.close();
        nativeLayer.marker.setMap(null);
        return;
      }

      nativeLayer.overlay.setMap(null);
    },
  };
}

function applyMaxZoomAfterFit(
  maps: typeof google.maps,
  map: google.maps.Map,
  options?: FitBoundsOptions,
): void {
  const maxZoom = options?.maxZoom;

  if (!isFiniteNumber(maxZoom)) {
    return;
  }

  maps.event.addListenerOnce(map, "idle", () => {
    const zoom = map.getZoom();
    if (isFiniteNumber(zoom) && zoom > maxZoom) {
      map.setZoom(maxZoom);
    }
  });
}

function getMarkerHandle(handle: MapLayerHandle): GoogleMapsMarkerHandle {
  return handle.nativeLayer as GoogleMapsMarkerHandle;
}

function getOverlayHandle(handle: MapLayerHandle): GoogleMapsOverlayHandle {
  return handle.nativeLayer as GoogleMapsOverlayHandle;
}

export function createGoogleMapsAdapter(): MapAdapter {
  return {
    engine: "google-maps",
    capabilities: googleMapsCapabilities,

    async createMap(options: CreateMapOptions): Promise<MapAdapterInstance> {
      const provider = resolveGoogleMapsProvider(options.provider);
      const maps = await loadGoogleMaps(provider);
      const map = new maps.Map(options.container, {
        center: toGoogleLatLngLiteral(options.center ?? [0, 0]),
        zoom: options.zoom ?? 2,
        minZoom: options.minZoom,
        maxZoom: options.maxZoom,
        mapId: resolveGoogleMapId(options),
        disableDefaultUI: false,
        zoomControl: options.controls?.zoom ?? true,
        fullscreenControl: options.controls?.fullscreen ?? true,
        mapTypeControl: false,
        streetViewControl: false,
        clickableIcons: true,
        ...(typeof options.engineOptions === "object" && options.engineOptions
          ? options.engineOptions
          : {}),
      });

      const clickListener = map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) {
          return;
        }

        options.onClick?.({
          position: [event.latLng.lat(), event.latLng.lng()],
          originalEvent: event.domEvent,
        });
      });
      const moveListener = map.addListener("idle", () => {
        const center = map.getCenter();
        const bounds = map.getBounds();

        if (!center) {
          return;
        }

        options.onMove?.({
          center: [center.lat(), center.lng()],
          zoom: map.getZoom() ?? 0,
          bounds: bounds
            ? [
                [bounds.getSouthWest().lat(), bounds.getSouthWest().lng()],
                [bounds.getNorthEast().lat(), bounds.getNorthEast().lng()],
              ]
            : undefined,
          originalEvent: undefined,
        });
      });

      if (options.bounds) {
        map.fitBounds(toGoogleBounds(maps, options.bounds));
      }

      const instance: GoogleMapsAdapterInstance = {
        engine: "google-maps",
        nativeMap: map,
        container: options.container,
        maps,
      };

      return {
        ...instance,
        dispose: () => {
          clickListener.remove();
          moveListener.remove();
        },
      } as MapAdapterInstance;
    },

    destroyMap(instance: MapAdapterInstance): void {
      (instance as MapAdapterInstance & { dispose?: () => void }).dispose?.();
      getMaps(instance).event.clearInstanceListeners(getMap(instance));
      getMap(instance).unbindAll();
    },

    setView(instance: MapAdapterInstance, view): void {
      const map = getMap(instance);
      map.setCenter(toGoogleLatLngLiteral(view.center));

      if (isFiniteNumber(view.zoom)) {
        map.setZoom(view.zoom);
      }
    },

    fitBounds(instance: MapAdapterInstance, bounds, options): void {
      const maps = getMaps(instance);
      const map = getMap(instance);
      map.fitBounds(toGoogleBounds(maps, bounds), toGooglePadding(options));
      applyMaxZoomAfterFit(maps, map, options);
    },

    addMarker(instance: MapAdapterInstance, marker: MarkerModel): MapLayerHandle {
      const maps = getMaps(instance);
      const map = getMap(instance);
      const googleMarker = new maps.Marker({
        map,
        position: toGoogleLatLngLiteral(marker.position),
        title: marker.tooltip ?? marker.title,
        draggable: marker.draggable,
        opacity: marker.visible === false ? 0 : 1,
        zIndex: marker.zIndex,
        icon: createMarkerIcon(maps, marker),
      });

      const popupContent = getMarkerPopupContent(marker);
      const infoWindow = popupContent
        ? new maps.InfoWindow({
            content: popupContent,
            maxWidth: marker.popupOptions?.maxWidth,
          })
        : undefined;
      if (infoWindow) {
        googleMarker.addListener("click", () => {
          infoWindow.open({ map, anchor: googleMarker });
        });
      }

      return createHandle(marker.id, {
        kind: "marker",
        marker: googleMarker,
        infoWindow,
      });
    },

    updateMarker(instance: MapAdapterInstance, handle: MapLayerHandle, marker: MarkerModel): void {
      const maps = getMaps(instance);
      const nativeLayer = getMarkerHandle(handle);
      nativeLayer.marker.setPosition(toGoogleLatLngLiteral(marker.position));
      nativeLayer.marker.setTitle(marker.tooltip ?? marker.title ?? "");
      nativeLayer.marker.setDraggable(marker.draggable ?? false);
      nativeLayer.marker.setOpacity(marker.visible === false ? 0 : 1);
      nativeLayer.marker.setZIndex(marker.zIndex ?? null);
      nativeLayer.marker.setIcon(createMarkerIcon(maps, marker));

      const popupContent = getMarkerPopupContent(marker);
      if (popupContent) {
        nativeLayer.infoWindow ??= new maps.InfoWindow();
        nativeLayer.infoWindow.setContent(popupContent);
      } else {
        nativeLayer.infoWindow?.close();
        nativeLayer.infoWindow = undefined;
      }
    },

    removeMarker(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      const nativeLayer = getMarkerHandle(handle);
      nativeLayer.infoWindow?.close();
      nativeLayer.marker.setMap(null);
    },

    addRoute(instance: MapAdapterInstance, route: RouteModel): MapLayerHandle {
      const maps = getMaps(instance);
      const polyline = new maps.Polyline({
        map: getMap(instance),
        path: route.coordinates.map(toGoogleLatLngLiteral),
        strokeColor: route.color ?? "#2563eb",
        strokeOpacity: route.opacity ?? 1,
        strokeWeight: route.width ?? 4,
        zIndex: route.zIndex,
        visible: route.visible !== false,
      });

      return createHandle(route.id, {
        kind: "overlay",
        overlay: polyline,
      });
    },

    updateRoute(_instance: MapAdapterInstance, handle: MapLayerHandle, route: RouteModel): void {
      const polyline = getOverlayHandle(handle).overlay as google.maps.Polyline;
      polyline.setPath(route.coordinates.map(toGoogleLatLngLiteral));
      polyline.setOptions({
        strokeColor: route.color ?? "#2563eb",
        strokeOpacity: route.opacity ?? 1,
        strokeWeight: route.width ?? 4,
        zIndex: route.zIndex,
        visible: route.visible !== false,
      });
    },

    removeRoute(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getOverlayHandle(handle).overlay.setMap(null);
    },

    addCircle(instance: MapAdapterInstance, circle: CircleModel): MapLayerHandle {
      const maps = getMaps(instance);
      const googleCircle = new maps.Circle({
        map: getMap(instance),
        center: toGoogleLatLngLiteral(circle.center),
        radius: circle.radius,
        strokeColor: circle.color ?? "#2563eb",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: circle.fillColor ?? circle.color ?? "#2563eb",
        fillOpacity: circle.fillOpacity ?? 0.18,
        zIndex: circle.zIndex,
        visible: circle.visible !== false,
      });

      return createHandle(circle.id, {
        kind: "overlay",
        overlay: googleCircle,
      });
    },

    updateCircle(_instance: MapAdapterInstance, handle: MapLayerHandle, circle: CircleModel): void {
      const googleCircle = getOverlayHandle(handle).overlay as google.maps.Circle;
      googleCircle.setCenter(toGoogleLatLngLiteral(circle.center));
      googleCircle.setRadius(circle.radius);
      googleCircle.setOptions({
        strokeColor: circle.color ?? "#2563eb",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: circle.fillColor ?? circle.color ?? "#2563eb",
        fillOpacity: circle.fillOpacity ?? 0.18,
        zIndex: circle.zIndex,
        visible: circle.visible !== false,
      });
    },

    removeCircle(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getOverlayHandle(handle).overlay.setMap(null);
    },

    addPolygon(instance: MapAdapterInstance, polygon: PolygonModel): MapLayerHandle {
      const maps = getMaps(instance);
      const googlePolygon = new maps.Polygon({
        map: getMap(instance),
        paths: polygon.coordinates.map(toGoogleLatLngLiteral),
        strokeColor: polygon.color ?? "#f97316",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: polygon.fillColor ?? polygon.color ?? "#f97316",
        fillOpacity: polygon.fillOpacity ?? 0.18,
        zIndex: polygon.zIndex,
        visible: polygon.visible !== false,
      });

      return createHandle(polygon.id, {
        kind: "overlay",
        overlay: googlePolygon,
      });
    },

    updatePolygon(_instance: MapAdapterInstance, handle: MapLayerHandle, polygon: PolygonModel): void {
      const googlePolygon = getOverlayHandle(handle).overlay as google.maps.Polygon;
      googlePolygon.setPaths(polygon.coordinates.map(toGoogleLatLngLiteral));
      googlePolygon.setOptions({
        strokeColor: polygon.color ?? "#f97316",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: polygon.fillColor ?? polygon.color ?? "#f97316",
        fillOpacity: polygon.fillOpacity ?? 0.18,
        zIndex: polygon.zIndex,
        visible: polygon.visible !== false,
      });
    },

    removePolygon(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getOverlayHandle(handle).overlay.setMap(null);
    },
  };
}

export const googleMapsAdapter = createGoogleMapsAdapter();
