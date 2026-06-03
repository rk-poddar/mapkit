import type { ProviderConfig } from "@map-kit/core";
import type { StyleSpecification } from "mapbox-gl";

const MAPBOX_DEFAULT_STYLE = "mapbox://styles/mapbox/streets-v12";

export function resolveMapboxStyle(provider?: ProviderConfig): string | StyleSpecification {
  const accessToken = provider?.accessToken ?? provider?.apiKey;

  if (!accessToken) {
    throw new Error("Mapbox provider requires an accessToken.");
  }

  if (!provider || provider.provider === "mapbox") {
    return provider?.styleUrl ?? MAPBOX_DEFAULT_STYLE;
  }

  if (provider.provider === "custom" && provider.styleUrl) {
    return provider.styleUrl;
  }

  throw new Error(`Provider "${provider.provider}" is not supported by the Mapbox adapter.`);
}
