import type {
  CircleModel,
  CreateMapOptions,
  LatLng,
  LatLngBounds,
  MapAdapter,
  MapAdapterInstance,
  MapLayerHandle,
  MarkerModel,
  PolygonModel,
  RouteModel,
} from "@map-kit/core";
import type {
  GeoJSONSource,
  Map as MapboxMap,
  Marker as MapboxMarker,
  Popup as MapboxPopup,
} from "mapbox-gl";
import type * as Mapbox from "mapbox-gl";
import { mapboxCapabilities } from "./capabilities";
import { resolveMapboxStyle } from "./provider";

type MapboxModule = typeof Mapbox;
type MapboxModuleWithToken = MapboxModule & {
  accessToken?: string | null;
};

type MapboxSourceHandle = {
  kind: "source";
  sourceId: string;
  layerIds: string[];
};

type MapboxMarkerHandle = {
  kind: "marker";
  marker: MapboxMarker;
  popup?: MapboxPopup;
};

type MapboxAdapterInstance = MapAdapterInstance & {
  mapboxgl?: MapboxModule;
};

let mapboxModulePromise: Promise<MapboxModule> | undefined;
const mapboxModuleByMap = new WeakMap<MapboxMap, MapboxModule>();

function loadMapbox(): Promise<MapboxModule> {
  mapboxModulePromise ??= import("mapbox-gl");
  return mapboxModulePromise;
}

function toLngLat(position: LatLng): [number, number] {
  return [position[1], position[0]];
}

function assertFinitePosition(position: LatLng, label: string): void {
  if (!Number.isFinite(position[0]) || !Number.isFinite(position[1])) {
    throw new Error(`Invalid ${label}: expected finite [lat, lng] coordinates.`);
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toMapboxBounds(bounds: LatLngBounds): [number, number, number, number] {
  const [first, second] = bounds;

  assertFinitePosition(first, "bounds[0]");
  assertFinitePosition(second, "bounds[1]");

  const south = Math.min(first[0], second[0]);
  const north = Math.max(first[0], second[0]);
  const west = Math.min(first[1], second[1]);
  const east = Math.max(first[1], second[1]);

  return [west, south, east, north];
}

function toMapboxFitBoundsOptions(options?: {
  maxZoom?: number;
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
}) {
  const fitBoundsOptions: {
    maxZoom?: number;
    padding?: number | { top: number; right: number; bottom: number; left: number };
  } = {};
  const maxZoom = options?.maxZoom;
  const padding = options?.padding;

  if (isFiniteNumber(maxZoom)) {
    fitBoundsOptions.maxZoom = maxZoom;
  }

  if (typeof padding === "number") {
    fitBoundsOptions.padding = isFiniteNumber(padding) ? padding : 0;
  } else if (padding) {
    const top = padding.top;
    const right = padding.right;
    const bottom = padding.bottom;
    const left = padding.left;

    fitBoundsOptions.padding = {
      top: isFiniteNumber(top) ? top : 0,
      right: isFiniteNumber(right) ? right : 0,
      bottom: isFiniteNumber(bottom) ? bottom : 0,
      left: isFiniteNumber(left) ? left : 0,
    };
  }

  return fitBoundsOptions;
}

function getMap(instance: MapAdapterInstance): MapboxMap {
  return instance.nativeMap as MapboxMap;
}

function getMapbox(instance: MapAdapterInstance): MapboxModule {
  const instanceMapbox = (instance as MapboxAdapterInstance).mapboxgl;

  if (instanceMapbox) {
    return instanceMapbox;
  }

  const mapbox = mapboxModuleByMap.get(getMap(instance));

  if (!mapbox) {
    throw new Error("Mapbox module is not available for this map instance.");
  }

  return mapbox;
}

function createHandle(id: string, nativeLayer: MapboxSourceHandle | MapboxMarkerHandle) {
  return {
    id,
    nativeLayer,
  };
}

function createMarkerElement(marker: MarkerModel): HTMLElement {
  const root = document.createElement("span");
  syncMarkerElement(root, marker);
  return root;
}

function syncMarkerElement(root: HTMLElement, marker: MarkerModel): void {
  root.replaceChildren();
  const size = marker.size === "sm" ? 18 : marker.size === "lg" ? 30 : 24;
  const dotSize = Math.max(6, Math.round(size * 0.36));
  const label = marker.label?.slice(0, 3);
  const variant = marker.variant ?? "pin";
  const isPin = variant === "pin";
  root.style.position = "relative";
  root.style.display = "block";
  root.style.width = `${size}px`;
  root.style.height = `${size}px`;
  root.style.opacity = marker.visible === false ? "0" : "1";
  root.title = marker.tooltip ?? marker.title ?? "";

  const pin = document.createElement("span");
  pin.style.alignItems = "center";
  pin.style.display = "flex";
  pin.style.justifyContent = "center";
  pin.style.width = `${size}px`;
  pin.style.height = `${size}px`;
  pin.style.borderRadius = variant === "badge" ? "999px" : "999px 999px 999px 0";
  pin.style.background = marker.color ?? "#2563eb";
  pin.style.border = "3px solid white";
  pin.style.boxShadow = "0 4px 12px rgb(15 23 42 / 30%)";
  pin.style.boxSizing = "border-box";
  pin.style.color = "white";
  pin.style.font = "700 11px/1 system-ui, sans-serif";
  pin.style.transform = isPin ? "rotate(-45deg)" : "none";

  if (label) {
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    labelElement.style.transform = isPin ? "rotate(45deg)" : "none";
    pin.append(labelElement);
    root.append(pin);
    return;
  }

  const dot = document.createElement("span");
  dot.style.position = "absolute";
  dot.style.left = `${Math.round((size - dotSize) / 2)}px`;
  dot.style.top = `${Math.round((size - dotSize) / 2)}px`;
  dot.style.display = "block";
  dot.style.width = `${dotSize}px`;
  dot.style.height = `${dotSize}px`;
  dot.style.borderRadius = "999px";
  dot.style.background = "white";

  root.append(pin, dot);
}

function getMarkerPopupContent(marker: MarkerModel): string | undefined {
  return [marker.title, marker.description, marker.popup].filter(Boolean).join("<br />");
}

function createLineFeature(route: RouteModel) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: route.coordinates.map(toLngLat),
    },
  };
}

function createPolygonFeature(polygon: PolygonModel) {
  const coordinates = polygon.coordinates.map(toLngLat);
  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];
  const closedCoordinates =
    first && last && (first[0] !== last[0] || first[1] !== last[1])
      ? [...coordinates, first]
      : coordinates;

  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [closedCoordinates],
    },
  };
}

function createCircleFeature(circle: CircleModel) {
  const points: [number, number][] = [];
  const steps = 96;
  const earthRadiusMeters = 6_371_008.8;
  const angularDistance = circle.radius / earthRadiusMeters;
  const lat = (circle.center[0] * Math.PI) / 180;
  const lng = (circle.center[1] * Math.PI) / 180;

  for (let index = 0; index <= steps; index += 1) {
    const bearing = (index / steps) * Math.PI * 2;
    const nextLat = Math.asin(
      Math.sin(lat) * Math.cos(angularDistance) +
        Math.cos(lat) * Math.sin(angularDistance) * Math.cos(bearing),
    );
    const nextLng =
      lng +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat),
        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(nextLat),
      );

    points.push([(nextLng * 180) / Math.PI, (nextLat * 180) / Math.PI]);
  }

  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "Polygon" as const,
      coordinates: [points],
    },
  };
}

function setSourceData(
  instance: MapAdapterInstance,
  sourceId: string,
  feature: ReturnType<typeof createLineFeature | typeof createCircleFeature | typeof createPolygonFeature>,
): void {
  const source = getMap(instance).getSource(sourceId) as GeoJSONSource | undefined;
  source?.setData({
    type: "FeatureCollection",
    features: [feature],
  } as Parameters<GeoJSONSource["setData"]>[0]);
}

function removeSourceHandle(instance: MapAdapterInstance, handle: MapLayerHandle): void {
  const map = getMap(instance);
  const nativeLayer = handle.nativeLayer as MapboxSourceHandle;

  for (const layerId of [...nativeLayer.layerIds].reverse()) {
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
  }

  if (map.getSource(nativeLayer.sourceId)) {
    map.removeSource(nativeLayer.sourceId);
  }
}

function createSourceHandle(id: string, sourceId: string, layerIds: string[]): MapLayerHandle {
  return createHandle(id, {
    kind: "source",
    sourceId,
    layerIds,
  });
}

export function createMapboxAdapter(): MapAdapter {
  return {
    engine: "mapbox",
    capabilities: mapboxCapabilities,

    async createMap(options: CreateMapOptions): Promise<MapAdapterInstance> {
      const mapboxgl = await loadMapbox();
      const accessToken = options.provider?.accessToken ?? options.provider?.apiKey;
      if (accessToken) {
        (mapboxgl as MapboxModuleWithToken).accessToken = accessToken;
      }

      const map = new mapboxgl.Map({
        container: options.container,
        style: resolveMapboxStyle(options.provider),
        center: toLngLat(options.center ?? [0, 0]),
        zoom: options.zoom ?? 2,
        minZoom: options.minZoom,
        maxZoom: options.maxZoom,
        attributionControl: options.attribution?.visible !== false,
        ...(typeof options.engineOptions === "object" && options.engineOptions
          ? options.engineOptions
          : {}),
      });

      mapboxModuleByMap.set(map, mapboxgl);

      if (options.controls?.zoom ?? true) {
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      }

      map.on("click", (event) => {
        options.onClick?.({
          position: [event.lngLat.lat, event.lngLat.lng],
          originalEvent: event.originalEvent,
        });
      });

      map.on("moveend", (event) => {
        const center = map.getCenter();
        const bounds = map.getBounds();
        const nextBounds: LatLngBounds | undefined = bounds
          ? [
              [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
              [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
            ]
          : undefined;

        options.onMove?.({
          center: [center.lat, center.lng],
          zoom: map.getZoom(),
          bounds: nextBounds,
          originalEvent: event,
        });
      });

      await new Promise<void>((resolve, reject) => {
        map.once("load", () => resolve());
        map.once("error", (event) => reject(event.error));
      });

      if (options.bounds) {
        map.fitBounds(toMapboxBounds(options.bounds));
      }

      const instance: MapboxAdapterInstance = {
        engine: "mapbox",
        nativeMap: map,
        container: options.container,
        mapboxgl,
      };

      return instance;
    },

    destroyMap(instance: MapAdapterInstance): void {
      const map = getMap(instance);
      mapboxModuleByMap.delete(map);
      map.remove();
    },

    setView(instance: MapAdapterInstance, view): void {
      const map = getMap(instance);
      map.jumpTo({
        center: toLngLat(view.center),
        zoom: view.zoom ?? map.getZoom(),
      });
    },

    fitBounds(instance: MapAdapterInstance, bounds, options): void {
      getMap(instance).fitBounds(toMapboxBounds(bounds), toMapboxFitBoundsOptions(options));
    },

    addMarker(instance: MapAdapterInstance, marker: MarkerModel): MapLayerHandle {
      const map = getMap(instance);
      const mapboxgl = getMapbox(instance);
      const element = createMarkerElement(marker);
      const mapMarker = new mapboxgl.Marker({
        element,
        draggable: marker.draggable,
      })
        .setLngLat(toLngLat(marker.position))
        .addTo(map);

      const popupContent = getMarkerPopupContent(marker);
      let popup: MapboxPopup | undefined;
      if (popupContent) {
        popup = new mapboxgl.Popup({
          closeButton: marker.popupOptions?.closeButton,
          maxWidth: marker.popupOptions?.maxWidth ? `${marker.popupOptions.maxWidth}px` : undefined,
          offset: 24,
        }).setHTML(popupContent);
        mapMarker.setPopup(popup);
      }

      return createHandle(marker.id, {
        kind: "marker",
        marker: mapMarker,
        popup,
      });
    },

    updateMarker(instance: MapAdapterInstance, handle: MapLayerHandle, marker: MarkerModel): void {
      const mapboxgl = getMapbox(instance);
      const nativeLayer = handle.nativeLayer as MapboxMarkerHandle;
      nativeLayer.marker.setLngLat(toLngLat(marker.position));
      syncMarkerElement(nativeLayer.marker.getElement(), marker);

      const popupContent = getMarkerPopupContent(marker);
      if (popupContent) {
        nativeLayer.popup ??= new mapboxgl.Popup({
          closeButton: marker.popupOptions?.closeButton,
          maxWidth: marker.popupOptions?.maxWidth ? `${marker.popupOptions.maxWidth}px` : undefined,
          offset: 24,
        });
        nativeLayer.popup.setHTML(popupContent);
        nativeLayer.marker.setPopup(nativeLayer.popup);
      } else {
        nativeLayer.popup?.remove();
        nativeLayer.popup = undefined;
      }
    },

    removeMarker(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      const nativeLayer = handle.nativeLayer as MapboxMarkerHandle;
      nativeLayer.popup?.remove();
      nativeLayer.marker.remove();
    },

    addRoute(instance: MapAdapterInstance, route: RouteModel): MapLayerHandle {
      const map = getMap(instance);
      const sourceId = `mapkit-route-source-${route.id}`;
      const layerId = `mapkit-route-layer-${route.id}`;
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [createLineFeature(route)],
        },
      });
      map.addLayer({
        id: layerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": route.color ?? "#2563eb",
          "line-width": route.width ?? 4,
          "line-opacity": route.opacity ?? 1,
          "line-dasharray": route.dashed ? [2, 2] : [1, 0],
        },
      });

      return createSourceHandle(route.id, sourceId, [layerId]);
    },

    updateRoute(instance: MapAdapterInstance, handle: MapLayerHandle, route: RouteModel): void {
      const map = getMap(instance);
      const nativeLayer = handle.nativeLayer as MapboxSourceHandle;
      const layerId = nativeLayer.layerIds[0];
      setSourceData(instance, nativeLayer.sourceId, createLineFeature(route));

      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, "line-color", route.color ?? "#2563eb");
        map.setPaintProperty(layerId, "line-width", route.width ?? 4);
        map.setPaintProperty(layerId, "line-opacity", route.opacity ?? 1);
        map.setPaintProperty(layerId, "line-dasharray", route.dashed ? [2, 2] : [1, 0]);
      }
    },

    removeRoute(instance: MapAdapterInstance, handle: MapLayerHandle): void {
      removeSourceHandle(instance, handle);
    },

    addCircle(instance: MapAdapterInstance, circle: CircleModel): MapLayerHandle {
      const map = getMap(instance);
      const sourceId = `mapkit-circle-source-${circle.id}`;
      const fillLayerId = `mapkit-circle-fill-${circle.id}`;
      const lineLayerId = `mapkit-circle-line-${circle.id}`;
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [createCircleFeature(circle)],
        },
      });
      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": circle.fillColor ?? circle.color ?? "#2563eb",
          "fill-opacity": circle.fillOpacity ?? 0.18,
        },
      });
      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": circle.color ?? "#2563eb",
          "line-width": 2,
        },
      });

      return createSourceHandle(circle.id, sourceId, [fillLayerId, lineLayerId]);
    },

    updateCircle(instance: MapAdapterInstance, handle: MapLayerHandle, circle: CircleModel): void {
      const map = getMap(instance);
      const nativeLayer = handle.nativeLayer as MapboxSourceHandle;
      const [fillLayerId, lineLayerId] = nativeLayer.layerIds;
      setSourceData(instance, nativeLayer.sourceId, createCircleFeature(circle));

      if (map.getLayer(fillLayerId)) {
        map.setPaintProperty(fillLayerId, "fill-color", circle.fillColor ?? circle.color ?? "#2563eb");
        map.setPaintProperty(fillLayerId, "fill-opacity", circle.fillOpacity ?? 0.18);
      }
      if (map.getLayer(lineLayerId)) {
        map.setPaintProperty(lineLayerId, "line-color", circle.color ?? "#2563eb");
      }
    },

    removeCircle(instance: MapAdapterInstance, handle: MapLayerHandle): void {
      removeSourceHandle(instance, handle);
    },

    addPolygon(instance: MapAdapterInstance, polygon: PolygonModel): MapLayerHandle {
      const map = getMap(instance);
      const sourceId = `mapkit-polygon-source-${polygon.id}`;
      const fillLayerId = `mapkit-polygon-fill-${polygon.id}`;
      const lineLayerId = `mapkit-polygon-line-${polygon.id}`;
      map.addSource(sourceId, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [createPolygonFeature(polygon)],
        },
      });
      map.addLayer({
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": polygon.fillColor ?? polygon.color ?? "#f97316",
          "fill-opacity": polygon.fillOpacity ?? 0.18,
        },
      });
      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": polygon.color ?? "#f97316",
          "line-width": 2,
        },
      });

      return createSourceHandle(polygon.id, sourceId, [fillLayerId, lineLayerId]);
    },

    updatePolygon(instance: MapAdapterInstance, handle: MapLayerHandle, polygon: PolygonModel): void {
      const map = getMap(instance);
      const nativeLayer = handle.nativeLayer as MapboxSourceHandle;
      const [fillLayerId, lineLayerId] = nativeLayer.layerIds;
      setSourceData(instance, nativeLayer.sourceId, createPolygonFeature(polygon));

      if (map.getLayer(fillLayerId)) {
        map.setPaintProperty(
          fillLayerId,
          "fill-color",
          polygon.fillColor ?? polygon.color ?? "#f97316",
        );
        map.setPaintProperty(fillLayerId, "fill-opacity", polygon.fillOpacity ?? 0.18);
      }
      if (map.getLayer(lineLayerId)) {
        map.setPaintProperty(lineLayerId, "line-color", polygon.color ?? "#f97316");
      }
    },

    removePolygon(instance: MapAdapterInstance, handle: MapLayerHandle): void {
      removeSourceHandle(instance, handle);
    },
  };
}

export const mapboxAdapter = createMapboxAdapter();
