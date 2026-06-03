import type { MapKitError, MapKitErrorCode, MapEngine, MapProvider } from "./types";

export function createMapKitError(
  code: MapKitErrorCode,
  message: string,
  context: {
    engine?: MapEngine;
    provider?: MapProvider;
    cause?: unknown;
  } = {},
): MapKitError {
  return {
    code,
    message,
    ...context,
  };
}

export function isMapKitError(error: unknown): error is MapKitError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
}
