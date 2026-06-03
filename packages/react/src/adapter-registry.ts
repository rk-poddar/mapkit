import type { MapAdapter, MapEngine } from "@map-kit/core";

export class MapAdapterRegistry {
  private readonly adapters = new globalThis.Map<MapEngine, MapAdapter>();

  constructor(initialAdapters: MapAdapter[] = []) {
    for (const adapter of initialAdapters) {
      this.register(adapter);
    }
  }

  register(adapter: MapAdapter): void {
    this.adapters.set(adapter.engine, adapter);
  }

  unregister(engine: MapEngine): void {
    this.adapters.delete(engine);
  }

  get(engine: MapEngine): MapAdapter | undefined {
    return this.adapters.get(engine);
  }

  has(engine: MapEngine): boolean {
    return this.adapters.has(engine);
  }

  list(): MapAdapter[] {
    return [...this.adapters.values()];
  }

  clear(): void {
    this.adapters.clear();
  }
}

export const defaultMapAdapterRegistry = new MapAdapterRegistry();

export function registerMapAdapter(adapter: MapAdapter): void {
  defaultMapAdapterRegistry.register(adapter);
}

export function unregisterMapAdapter(engine: MapEngine): void {
  defaultMapAdapterRegistry.unregister(engine);
}

export function getMapAdapter(engine: MapEngine): MapAdapter | undefined {
  return defaultMapAdapterRegistry.get(engine);
}
