import {
  normalizeProviderConfig,
  validateProviderConfig,
  type LatLng,
  type MapAdapter,
  type MapAdapterInstance,
  type MapKitError,
  type ProviderConfig,
} from "@map-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { getMapAdapter } from "../adapter-registry";
import { createFallbackMapController } from "../controller";
import { MapLayerSync } from "../layer-sync";
import { MapContextProvider } from "../map-context";
import type { MapProps } from "../types";

const DEFAULT_CENTER: LatLng = [0, 0];
const DEFAULT_ZOOM = 2;

function resolveProviderConfig(props: MapProps): ProviderConfig | undefined {
  if (!props.provider) {
    return undefined;
  }

  const providerConfig: ProviderConfig =
    typeof props.provider === "string"
      ? {
          provider: props.provider,
          apiKey: props.apiKey,
          accessToken: props.accessToken,
        }
      : {
          ...props.provider,
          apiKey: props.provider.apiKey ?? props.apiKey,
          accessToken: props.provider.accessToken ?? props.accessToken,
        };

  return normalizeProviderConfig(providerConfig);
}

function resolveAdapter(props: MapProps): MapAdapter | undefined {
  return props.adapter ?? getMapAdapter(props.engine);
}

export function Map(props: MapProps) {
  const {
    engine,
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    className,
    style,
    children,
    fallback,
    onError,
    onReady,
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const adapterRef = useRef<MapAdapter | undefined>(undefined);
  const instanceRef = useRef<MapAdapterInstance | undefined>(undefined);
  const viewStateRef = useRef({ center, zoom });
  const [viewState, setViewState] = useState({ center, zoom });
  const [instance, setInstance] = useState<MapAdapterInstance | undefined>();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<MapKitError | undefined>();

  const adapter = useMemo(() => resolveAdapter(props), [props.adapter, props.engine]);
  const provider = useMemo(
    () => resolveProviderConfig(props),
    [props.accessToken, props.apiKey, props.provider],
  );

  const controller = useMemo(
    () =>
      createFallbackMapController(engine, {
        getCenter: () => viewStateRef.current.center,
        getZoom: () => viewStateRef.current.zoom,
        setView: (nextCenter, nextZoom) => {
          setViewState((current) => ({
            center: nextCenter,
            zoom: nextZoom ?? current.zoom,
          }));

          const currentAdapter = adapterRef.current;
          const currentInstance = instanceRef.current;
          if (currentAdapter && currentInstance) {
            currentAdapter.setView(currentInstance, {
              center: nextCenter,
              zoom: nextZoom ?? viewStateRef.current.zoom,
            });
          }
        },
        fitBounds: (bounds, options) => {
          const currentAdapter = adapterRef.current;
          const currentInstance = instanceRef.current;
          if (currentAdapter && currentInstance) {
            currentAdapter.fitBounds(currentInstance, bounds, options);
          }
        },
        panTo: (nextCenter, options) => {
          const currentAdapter = adapterRef.current;
          const currentInstance = instanceRef.current;
          if (currentAdapter && currentInstance) {
            currentAdapter.setView(currentInstance, {
              center: nextCenter,
              zoom: options?.durationMs ? undefined : viewStateRef.current.zoom,
            });
          }

          setViewState((current) => ({
            center: nextCenter,
            zoom: current.zoom,
          }));
        },
        getNativeMap: () => {
          return instanceRef.current?.nativeMap;
        },
      }),
    [engine],
  );

  useEffect(() => {
    setViewState({ center, zoom });
  }, [center, zoom]);

  useEffect(() => {
    adapterRef.current = adapter;
  }, [adapter]);

  useEffect(() => {
    instanceRef.current = instance;
  }, [instance]);

  useEffect(() => {
    viewStateRef.current = viewState;
  }, [viewState]);

  useEffect(() => {
    if (!provider) {
      return;
    }

    const providerErrors = validateProviderConfig(provider, { engine });
    if (providerErrors.length === 0) {
      return;
    }

    setError(providerErrors[0]);
    onError?.(providerErrors[0]);
  }, [engine, onError, provider]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !adapter) {
      setIsReady(false);
      return;
    }

    let disposed = false;
    let nextInstance: MapAdapterInstance | undefined;

    adapter
      .createMap({
        container,
        center: viewState.center,
        zoom: viewState.zoom,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        bounds: props.bounds,
        provider,
        controls: props.controls,
        attribution: props.attribution,
        engineOptions: props.engineOptions,
        onClick: props.onClick,
        onMove: props.onMove,
        onError,
      })
      .then((createdInstance) => {
        if (disposed) {
          adapter.destroyMap(createdInstance);
          return;
        }

        nextInstance = createdInstance;
        instanceRef.current = createdInstance;
        setInstance(createdInstance);
        setIsReady(true);
        setError(undefined);
        onReady?.(controller);
      })
      .catch((cause: unknown) => {
        const nextError: MapKitError = {
          code: "engine-load-failed",
          message: `Unable to create ${engine} map instance.`,
          engine,
          cause,
        };
        setError(nextError);
        onError?.(nextError);
      });

    return () => {
      disposed = true;
      setIsReady(false);
      instanceRef.current = undefined;
      setInstance(undefined);

      if (nextInstance) {
        adapter.destroyMap(nextInstance);
      }
    };
  }, [
    adapter,
    controller,
    engine,
    onError,
    onReady,
    props.attribution,
    props.bounds,
    props.controls,
    props.engineOptions,
    props.maxZoom,
    props.minZoom,
    props.onClick,
    props.onMove,
    provider,
  ]);

  useEffect(() => {
    if (!adapter || !instance) {
      return;
    }

    adapter.setView(instance, viewState);
  }, [adapter, instance, viewState]);

  return (
    <MapContextProvider
      adapter={adapter}
      controller={controller}
      engine={engine}
      error={error}
      instance={instance}
      isReady={isReady}
    >
      <div
        ref={containerRef}
        className={className}
        data-mapkit-engine={engine}
        data-mapkit-ready={isReady ? "true" : "false"}
        style={style}
      >
        {!adapter ? fallback : null}
      </div>
      <MapLayerSync />
      {children}
    </MapContextProvider>
  );
}
