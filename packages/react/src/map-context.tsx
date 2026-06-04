import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { MapContextValue, MapLayerState, MapLifecycleState } from "./types";

const MapContext = createContext<MapContextValue | null>(null);

export type MapContextProviderProps = PropsWithChildren<
  MapLifecycleState & {
    layers?: Iterable<MapLayerState>;
  }
>;

export function MapContextProvider({
  children,
  layers: initialLayers = [],
  ...lifecycle
}: MapContextProviderProps) {
  const { adapter, container, controller, engine, error, instance, isReady } = lifecycle;
  const [layers, setLayers] = useState<ReadonlyMap<string, MapLayerState>>(() => {
    const nextLayers = new globalThis.Map<string, MapLayerState>();

    for (const layer of initialLayers) {
      nextLayers.set(layer.model.id, layer);
    }

    return nextLayers;
  });

  const setLayer = useCallback((layer: MapLayerState) => {
    setLayers((currentLayers) => {
      const nextLayers = new globalThis.Map(currentLayers);
      nextLayers.set(layer.model.id, layer);
      return nextLayers;
    });
  }, []);

  const removeLayer = useCallback((id: string) => {
    setLayers((currentLayers) => {
      if (!currentLayers.has(id)) {
        return currentLayers;
      }

      const nextLayers = new globalThis.Map(currentLayers);
      nextLayers.delete(id);
      return nextLayers;
    });
  }, []);

  const getLayer = useCallback(
    (id: string) => {
      return layers.get(id);
    },
    [layers],
  );

  const value = useMemo<MapContextValue>(
    () => ({
      adapter,
      controller,
      container,
      engine,
      error,
      instance,
      isReady,
      layers,
      registerLayer: setLayer,
      updateLayer: setLayer,
      removeLayer,
      getLayer,
    }),
    [
      adapter,
      container,
      controller,
      engine,
      error,
      getLayer,
      instance,
      isReady,
      layers,
      removeLayer,
      setLayer,
    ],
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMapContext(): MapContextValue {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("Map Kit hooks and layer components must be used inside <Map>.");
  }

  return context;
}

export function useMap() {
  return useMapContext().controller;
}

export function useMapReady(): boolean {
  return useMapContext().isReady;
}

export function useMapLayers(): ReadonlyMap<string, MapLayerState> {
  return useMapContext().layers;
}
