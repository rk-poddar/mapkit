import type { ProviderConfig } from "@map-kit/core";
import type { StyleSpecification } from "maplibre-gl";

const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const CARTO_TILE_URL = "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
const MAPTILER_STYLE_URL = "https://api.maptiler.com/maps/streets-v2/style.json?key={key}";

export function resolveMapLibreStyle(provider?: ProviderConfig): string | StyleSpecification {
  if (!provider || provider.provider === "osm") {
    return createRasterStyle({
      tileUrl: provider?.tileUrl ?? OSM_TILE_URL,
      attribution: provider?.attribution ?? "© OpenStreetMap contributors",
      maxZoom: provider?.maxZoom ?? 19,
    });
  }

  if (provider.styleUrl) {
    return withProviderToken(provider.styleUrl, provider);
  }

  if (provider.provider === "carto") {
    return createRasterStyle({
      tileUrl: provider.tileUrl ?? CARTO_TILE_URL,
      attribution: provider.attribution ?? "© OpenStreetMap contributors © CARTO",
      maxZoom: provider.maxZoom ?? 20,
    });
  }

  if (provider.provider === "maptiler") {
    return MAPTILER_STYLE_URL.replace("{key}", encodeURIComponent(provider.apiKey ?? ""));
  }

  if (provider.provider === "custom" && provider.tileUrl) {
    return createRasterStyle({
      tileUrl: provider.tileUrl,
      attribution: provider.attribution ?? "",
      maxZoom: provider.maxZoom ?? 22,
    });
  }

  throw new Error(`Provider "${provider.provider}" requires a MapLibre styleUrl.`);
}

function withProviderToken(styleUrl: string, provider: ProviderConfig): string {
  if (provider.provider === "mapbox" && provider.accessToken) {
    const url = new URL(styleUrl);
    url.searchParams.set("access_token", provider.accessToken);
    return url.toString();
  }

  return styleUrl;
}

function createRasterStyle(options: {
  tileUrl: string;
  attribution: string;
  maxZoom: number;
}): StyleSpecification {
  return {
    version: 8,
    sources: {
      "mapkit-raster": {
        type: "raster",
        tiles: [options.tileUrl],
        tileSize: 256,
        attribution: options.attribution,
        maxzoom: options.maxZoom,
      },
    },
    layers: [
      {
        id: "mapkit-raster",
        type: "raster",
        source: "mapkit-raster",
      },
    ],
  };
}
