import { createMapKitError } from "./errors";
import type { MapEngine, MapKitError, MapProvider, ProviderConfig } from "./types";

export const DEFAULT_ATTRIBUTIONS: Record<MapProvider, string> = {
  osm: "© OpenStreetMap contributors",
  carto: "© OpenStreetMap contributors © CARTO",
  maptiler: "© MapTiler © OpenStreetMap contributors",
  google: "© Google",
  mapbox: "© Mapbox © OpenStreetMap",
  custom: "",
};

export const PROVIDER_ENV_HINTS: Partial<Record<MapProvider, string>> = {
  maptiler: "NEXT_PUBLIC_MAPTILER_KEY",
  google: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY",
  mapbox: "NEXT_PUBLIC_MAPBOX_TOKEN",
};

export const ENGINE_PROVIDER_COMPATIBILITY: Record<MapEngine, readonly MapProvider[]> = {
  leaflet: ["osm", "carto", "maptiler", "custom"],
  maplibre: ["maptiler", "mapbox", "custom"],
  "google-maps": ["google"],
  mapbox: ["mapbox"],
};

export function getDefaultAttribution(provider: MapProvider): string {
  return DEFAULT_ATTRIBUTIONS[provider];
}

export function requiresApiKey(provider: MapProvider): boolean {
  return provider === "maptiler" || provider === "google";
}

export function requiresAccessToken(provider: MapProvider): boolean {
  return provider === "mapbox";
}

export function isProviderCompatibleWithEngine(
  engine: MapEngine,
  provider: MapProvider,
): boolean {
  return ENGINE_PROVIDER_COMPATIBILITY[engine].includes(provider);
}

export function normalizeProviderConfig(config: ProviderConfig): ProviderConfig {
  return {
    ...config,
    attribution:
      config.attribution ?? DEFAULT_ATTRIBUTIONS[config.provider] ?? config.attribution,
  };
}

export function validateProviderConfig(
  config: ProviderConfig,
  options: { engine?: MapEngine } = {},
): MapKitError[] {
  const errors: MapKitError[] = [];
  const provider = config.provider;

  if (
    options.engine &&
    !isProviderCompatibleWithEngine(options.engine, provider)
  ) {
    errors.push(
      createMapKitError(
        "unsupported-capability",
        `Provider "${provider}" is not supported by engine "${options.engine}".`,
        { engine: options.engine, provider },
      ),
    );
  }

  if (requiresApiKey(provider) && !config.apiKey) {
    errors.push(
      createMapKitError(
        "missing-api-key",
        `${provider} provider requires an API key${
          PROVIDER_ENV_HINTS[provider] ? ` such as ${PROVIDER_ENV_HINTS[provider]}` : ""
        }.`,
        { provider },
      ),
    );
  }

  if (requiresAccessToken(provider) && !config.accessToken && !config.apiKey) {
    errors.push(
      createMapKitError(
        "missing-api-key",
        `${provider} provider requires an access token${
          PROVIDER_ENV_HINTS[provider] ? ` such as ${PROVIDER_ENV_HINTS[provider]}` : ""
        }.`,
        { provider },
      ),
    );
  }

  const attribution = config.attribution ?? DEFAULT_ATTRIBUTIONS[provider];
  if (!config.allowMissingAttribution && attribution.trim().length === 0) {
    errors.push(
      createMapKitError(
        "missing-attribution",
        `Provider "${provider}" requires explicit attribution or an unsafe acknowledgement.`,
        { provider },
      ),
    );
  }

  if (provider === "custom" && !config.tileUrl && !config.styleUrl) {
    errors.push(
      createMapKitError(
        "provider-load-failed",
        'Custom provider requires either "tileUrl" or "styleUrl".',
        { provider },
      ),
    );
  }

  return errors;
}
