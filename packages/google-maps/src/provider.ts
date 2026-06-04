import type { CreateMapOptions, ProviderConfig } from "@map-kit/core";

export type GoogleMapsProviderOptions = {
  apiKey: string;
  language?: string;
  region?: string;
  mapId?: string;
};

export function resolveGoogleMapsProvider(provider?: ProviderConfig): GoogleMapsProviderOptions {
  const apiKey = provider?.apiKey ?? provider?.accessToken;

  if (!apiKey) {
    throw new Error("Google Maps provider requires an apiKey.");
  }

  if (provider && provider.provider !== "google") {
    throw new Error(`Provider "${provider.provider}" is not supported by the Google Maps adapter.`);
  }

  return {
    apiKey,
  };
}

export function resolveGoogleMapId(options: CreateMapOptions): string | undefined {
  const engineOptions = options.engineOptions;

  if (
    typeof engineOptions === "object" &&
    engineOptions &&
    "mapId" in engineOptions &&
    typeof engineOptions.mapId === "string"
  ) {
    return engineOptions.mapId;
  }

  return undefined;
}
