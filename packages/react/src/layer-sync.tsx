import { useEffect, useRef } from "react";
import type { MapLayerHandle } from "@map-kit/core";
import { useMapContext } from "./map-context";
import type { MapLayerState } from "./types";

type StyleAwareNativeMap = {
  on: (type: "style.load", listener: () => void) => void;
  off: (type: "style.load", listener: () => void) => void;
};

type StoredLayer = {
  kind: MapLayerState["kind"];
  handle: MapLayerHandle;
};

export function MapLayerSync() {
  const { adapter, engine, instance, isReady, layers } = useMapContext();
  const handlesRef = useRef(new globalThis.Map<string, StoredLayer>());
  const layersRef = useRef(layers);

  layersRef.current = layers;

  useEffect(() => {
    if (!adapter || !instance || !isReady) {
      for (const storedLayer of handlesRef.current.values()) {
        storedLayer.handle.dispose?.();
      }
      handlesRef.current.clear();
      return;
    }

    const activeIds = new globalThis.Set(layers.keys());

    for (const [id, storedLayer] of handlesRef.current) {
      if (!activeIds.has(id)) {
        removeNativeLayer(adapter, instance, storedLayer);
        handlesRef.current.delete(id);
      }
    }

    for (const layer of layers.values()) {
      const storedLayer = handlesRef.current.get(layer.model.id);

      if (!storedLayer || storedLayer.kind !== layer.kind) {
        if (storedLayer) {
          removeNativeLayer(adapter, instance, storedLayer);
        }

        handlesRef.current.set(layer.model.id, {
          kind: layer.kind,
          handle: addNativeLayer(adapter, instance, layer),
        });
        continue;
      }

      updateNativeLayer(adapter, instance, storedLayer.handle, layer);
    }
  }, [adapter, instance, isReady, layers]);

  useEffect(() => {
    if (!adapter || !instance || !isReady || engine !== "maplibre") {
      return;
    }

    const nativeMap = instance.nativeMap as StyleAwareNativeMap | undefined;
    if (!nativeMap || typeof nativeMap.on !== "function") {
      return;
    }

    const resyncLayersAfterStyleChange = () => {
      handlesRef.current.clear();

      for (const layer of layersRef.current.values()) {
        handlesRef.current.set(layer.model.id, {
          kind: layer.kind,
          handle: addNativeLayer(adapter, instance, layer),
        });
      }
    };

    nativeMap.on("style.load", resyncLayersAfterStyleChange);

    return () => {
      nativeMap.off("style.load", resyncLayersAfterStyleChange);
    };
  }, [adapter, engine, instance, isReady]);

  useEffect(() => {
    return () => {
      for (const storedLayer of handlesRef.current.values()) {
        storedLayer.handle.dispose?.();
      }
      handlesRef.current.clear();
    };
  }, []);

  return null;
}

function addNativeLayer(
  adapter: NonNullable<ReturnType<typeof useMapContext>["adapter"]>,
  instance: NonNullable<ReturnType<typeof useMapContext>["instance"]>,
  layer: MapLayerState,
): MapLayerHandle {
  if (layer.kind === "marker") {
    return adapter.addMarker(instance, layer.model);
  }

  if (layer.kind === "route") {
    return adapter.addRoute(instance, layer.model);
  }

  if (layer.kind === "circle") {
    return adapter.addCircle(instance, layer.model);
  }

  return adapter.addPolygon(instance, layer.model);
}

function updateNativeLayer(
  adapter: NonNullable<ReturnType<typeof useMapContext>["adapter"]>,
  instance: NonNullable<ReturnType<typeof useMapContext>["instance"]>,
  handle: MapLayerHandle,
  layer: MapLayerState,
): void {
  if (layer.kind === "marker") {
    adapter.updateMarker(instance, handle, layer.model);
    return;
  }

  if (layer.kind === "route") {
    adapter.updateRoute(instance, handle, layer.model);
    return;
  }

  if (layer.kind === "circle") {
    adapter.updateCircle(instance, handle, layer.model);
    return;
  }

  adapter.updatePolygon(instance, handle, layer.model);
}

function removeNativeLayer(
  adapter: NonNullable<ReturnType<typeof useMapContext>["adapter"]>,
  instance: NonNullable<ReturnType<typeof useMapContext>["instance"]>,
  storedLayer: StoredLayer,
): void {
  if (storedLayer.kind === "marker") {
    adapter.removeMarker(instance, storedLayer.handle);
    return;
  }

  if (storedLayer.kind === "route") {
    adapter.removeRoute(instance, storedLayer.handle);
    return;
  }

  if (storedLayer.kind === "circle") {
    adapter.removeCircle(instance, storedLayer.handle);
    return;
  }

  adapter.removePolygon(instance, storedLayer.handle);
}
