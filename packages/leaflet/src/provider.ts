import type { ProviderConfig } from "@map-kit/core";

export type LeafletTileConfig = {
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string[];
};

const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const CARTO_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const MAPTILER_TILE_URL =
  "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key={key}";

export function resolveLeafletTileConfig(provider?: ProviderConfig): LeafletTileConfig {
  if (!provider || provider.provider === "osm") {
    return {
      url: provider?.tileUrl ?? OSM_TILE_URL,
      attribution: provider?.attribution ?? "© OpenStreetMap contributors",
      maxZoom: provider?.maxZoom ?? 19,
      subdomains: provider?.subdomains ?? ["a", "b", "c"],
    };
  }

  if (provider.provider === "carto") {
    return {
      url: provider.tileUrl ?? CARTO_TILE_URL,
      attribution: provider.attribution ?? "© OpenStreetMap contributors © CARTO",
      maxZoom: provider.maxZoom ?? 20,
      subdomains: provider.subdomains ?? ["a", "b", "c", "d"],
    };
  }

  if (provider.provider === "maptiler") {
    return {
      url:
        provider.tileUrl ??
        MAPTILER_TILE_URL.replace("{key}", encodeURIComponent(provider.apiKey ?? "")),
      attribution: provider.attribution ?? "© MapTiler © OpenStreetMap contributors",
      maxZoom: provider.maxZoom ?? 20,
      subdomains: provider.subdomains,
    };
  }

  if (provider.provider === "custom" && provider.tileUrl) {
    return {
      url: provider.tileUrl,
      attribution: provider.attribution ?? "",
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains,
    };
  }

  throw new Error(`Provider "${provider.provider}" cannot be rendered by Leaflet raster tiles.`);
}
