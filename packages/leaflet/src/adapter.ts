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
import { leafletCapabilities } from "./capabilities";
import { resolveLeafletTileConfig } from "./provider";
import type * as Leaflet from "leaflet";

type LeafletModule = typeof Leaflet;
type LeafletMap = Leaflet.Map;
type LeafletLayer = Leaflet.Layer;
type LeafletMarker = Leaflet.Marker;
type LeafletPolyline = Leaflet.Polyline;
type LeafletCircle = Leaflet.Circle;
type LeafletPolygon = Leaflet.Polygon;

let leafletModulePromise: Promise<LeafletModule> | undefined;
const leafletModuleByMap = new WeakMap<LeafletMap, LeafletModule>();

function loadLeaflet(): Promise<LeafletModule> {
  leafletModulePromise ??= import("leaflet");
  return leafletModulePromise;
}

function toLeafletLatLng(position: LatLng): Leaflet.LatLngTuple {
  return [position[0], position[1]];
}

function toLeafletLatLngs(positions: LatLng[]): Leaflet.LatLngTuple[] {
  return positions.map(toLeafletLatLng);
}

function toLeafletBounds(bounds: LatLngBounds): Leaflet.LatLngBoundsExpression {
  return [toLeafletLatLng(bounds[0]), toLeafletLatLng(bounds[1])];
}

function getMap(instance: MapAdapterInstance): LeafletMap {
  return instance.nativeMap as LeafletMap;
}

function getLeaflet(instance: MapAdapterInstance): LeafletModule {
  const leaflet = leafletModuleByMap.get(getMap(instance));

  if (!leaflet) {
    throw new Error("Leaflet module is not available for this map instance.");
  }

  return leaflet;
}

function getLayer<TLayer extends LeafletLayer>(handle: MapLayerHandle): TLayer {
  return handle.nativeLayer as TLayer;
}

function createHandle(id: string, nativeLayer: LeafletLayer): MapLayerHandle {
  return {
    id,
    nativeLayer,
    dispose: () => {
      nativeLayer.remove();
    },
  };
}

function createMarkerIcon(L: LeafletModule, marker: MarkerModel): Leaflet.DivIcon {
  const color = marker.color ?? "#2563eb";

  return L.divIcon({
    className: "mapkit-leaflet-marker",
    html: [
      `<span style="`,
      "display:block;",
      "width:22px;",
      "height:22px;",
      "border-radius:999px 999px 999px 0;",
      `background:${color};`,
      "border:3px solid white;",
      "box-shadow:0 4px 12px rgb(15 23 42 / 30%);",
      "transform:rotate(-45deg);",
      `"></span>`,
      `<span style="`,
      "position:absolute;",
      "left:7px;",
      "top:7px;",
      "display:block;",
      "width:8px;",
      "height:8px;",
      "border-radius:999px;",
      "background:white;",
      `"></span>`,
    ].join(""),
    iconAnchor: [11, 22],
    iconSize: [22, 22],
    popupAnchor: [0, -22],
  });
}

function applyPathStyle(
  layer: LeafletPolyline | LeafletCircle | LeafletPolygon,
  model: RouteModel | CircleModel | PolygonModel,
): void {
  layer.setStyle({
    color: model.color,
    fillColor: "fillColor" in model ? model.fillColor : undefined,
    fillOpacity: "fillOpacity" in model ? model.fillOpacity : undefined,
    opacity: "opacity" in model ? model.opacity : undefined,
    weight: "width" in model ? model.width : undefined,
    dashArray: "dashed" in model && model.dashed ? "6 6" : undefined,
  });
}

export function createLeafletAdapter(): MapAdapter {
  return {
    engine: "leaflet",
    capabilities: leafletCapabilities,

    async createMap(options: CreateMapOptions): Promise<MapAdapterInstance> {
      const L = await loadLeaflet();
      const tileConfig = resolveLeafletTileConfig(options.provider);
      const map = L.map(options.container, {
        center: toLeafletLatLng(options.center ?? [0, 0]),
        zoom: options.zoom ?? 2,
        minZoom: options.minZoom,
        maxZoom: options.maxZoom,
        attributionControl: options.attribution?.visible !== false,
        zoomControl: options.controls?.zoom ?? true,
      });

      L.tileLayer(tileConfig.url, {
        attribution: options.attribution?.content ?? tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
        subdomains: tileConfig.subdomains,
      }).addTo(map);
      leafletModuleByMap.set(map, L);

      if (options.bounds) {
        map.fitBounds(toLeafletBounds(options.bounds));
      }

      map.on("click", (event) => {
        options.onClick?.({
          position: [event.latlng.lat, event.latlng.lng],
          originalEvent: event.originalEvent,
        });
      });

      map.on("moveend", (event) => {
        const center = map.getCenter();
        const bounds = map.getBounds();
        options.onMove?.({
          center: [center.lat, center.lng],
          zoom: map.getZoom(),
          bounds: [
            [bounds.getSouthWest().lat, bounds.getSouthWest().lng],
            [bounds.getNorthEast().lat, bounds.getNorthEast().lng],
          ],
          originalEvent: event,
        });
      });

      return {
        engine: "leaflet",
        nativeMap: map,
        container: options.container,
      };
    },

    destroyMap(instance: MapAdapterInstance): void {
      const map = getMap(instance);
      leafletModuleByMap.delete(map);
      map.remove();
    },

    setView(instance: MapAdapterInstance, view): void {
      const map = getMap(instance);
      map.setView(toLeafletLatLng(view.center), view.zoom ?? map.getZoom());
    },

    fitBounds(instance: MapAdapterInstance, bounds, options): void {
      getMap(instance).fitBounds(toLeafletBounds(bounds), {
        maxZoom: options?.maxZoom,
        paddingTopLeft:
          typeof options?.padding === "object"
            ? [options.padding.left ?? 0, options.padding.top ?? 0]
            : undefined,
        paddingBottomRight:
          typeof options?.padding === "object"
            ? [options.padding.right ?? 0, options.padding.bottom ?? 0]
            : undefined,
        padding:
          typeof options?.padding === "number" ? [options.padding, options.padding] : undefined,
      });
    },

    addMarker(instance: MapAdapterInstance, marker: MarkerModel): MapLayerHandle {
      const map = getMap(instance);
      const L = getLeaflet(instance);
      const markerLayer = L.marker(toLeafletLatLng(marker.position), {
        icon: createMarkerIcon(L, marker),
        title: marker.title,
        draggable: marker.draggable,
        opacity: marker.visible === false ? 0 : 1,
        zIndexOffset: marker.zIndex,
      }).addTo(map);

      if (marker.title || marker.description) {
        markerLayer.bindPopup([marker.title, marker.description].filter(Boolean).join("<br />"));
      }

      return createHandle(marker.id, markerLayer);
    },

    updateMarker(_instance: MapAdapterInstance, handle: MapLayerHandle, marker: MarkerModel): void {
      const markerLayer = getLayer<LeafletMarker>(handle);
      markerLayer.setLatLng(toLeafletLatLng(marker.position));
      markerLayer.setOpacity(marker.visible === false ? 0 : 1);
      markerLayer.setZIndexOffset(marker.zIndex ?? 0);
      markerLayer.setIcon(createMarkerIcon(getLeaflet(_instance), marker));

      if (marker.title || marker.description) {
        markerLayer.bindPopup([marker.title, marker.description].filter(Boolean).join("<br />"));
      } else {
        markerLayer.unbindPopup();
      }
    },

    removeMarker(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getLayer<LeafletMarker>(handle).remove();
    },

    addRoute(instance: MapAdapterInstance, route: RouteModel): MapLayerHandle {
      const map = getMap(instance);
      const L = getLeaflet(instance);
      const polyline = L.polyline(toLeafletLatLngs(route.coordinates)).addTo(map);
      applyPathStyle(polyline, route);
      return createHandle(route.id, polyline);
    },

    updateRoute(_instance: MapAdapterInstance, handle: MapLayerHandle, route: RouteModel): void {
      const polyline = getLayer<LeafletPolyline>(handle);
      polyline.setLatLngs(toLeafletLatLngs(route.coordinates));
      applyPathStyle(polyline, route);
    },

    removeRoute(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getLayer<LeafletPolyline>(handle).remove();
    },

    addCircle(instance: MapAdapterInstance, circle: CircleModel): MapLayerHandle {
      const map = getMap(instance);
      const L = getLeaflet(instance);
      const circleLayer = L.circle(toLeafletLatLng(circle.center), {
        radius: circle.radius,
      }).addTo(map);
      applyPathStyle(circleLayer, circle);
      return createHandle(circle.id, circleLayer);
    },

    updateCircle(_instance: MapAdapterInstance, handle: MapLayerHandle, circle: CircleModel): void {
      const circleLayer = getLayer<LeafletCircle>(handle);
      circleLayer.setLatLng(toLeafletLatLng(circle.center));
      circleLayer.setRadius(circle.radius);
      applyPathStyle(circleLayer, circle);
    },

    removeCircle(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getLayer<LeafletCircle>(handle).remove();
    },

    addPolygon(instance: MapAdapterInstance, polygon: PolygonModel): MapLayerHandle {
      const map = getMap(instance);
      const L = getLeaflet(instance);
      const polygonLayer = L.polygon(toLeafletLatLngs(polygon.coordinates)).addTo(map);
      applyPathStyle(polygonLayer, polygon);
      return createHandle(polygon.id, polygonLayer);
    },

    updatePolygon(
      _instance: MapAdapterInstance,
      handle: MapLayerHandle,
      polygon: PolygonModel,
    ): void {
      const polygonLayer = getLayer<LeafletPolygon>(handle);
      polygonLayer.setLatLngs(toLeafletLatLngs(polygon.coordinates));
      applyPathStyle(polygonLayer, polygon);
    },

    removePolygon(_instance: MapAdapterInstance, handle: MapLayerHandle): void {
      getLayer<LeafletPolygon>(handle).remove();
    },
  };
}

export const leafletAdapter = createLeafletAdapter();
