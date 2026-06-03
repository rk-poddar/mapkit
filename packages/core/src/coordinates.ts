import type { LatLng, LngLat } from "./types";

export function toLngLat(position: LatLng): LngLat {
  return [position[1], position[0]];
}

export function toLatLng(position: LngLat): LatLng {
  return [position[1], position[0]];
}

export function isValidLatitude(latitude: number): boolean {
  return Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
}

export function isValidLongitude(longitude: number): boolean {
  return Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function isValidLatLng(position: LatLng): boolean {
  const [latitude, longitude] = position;
  return isValidLatitude(latitude) && isValidLongitude(longitude);
}

export function assertValidLatLng(position: LatLng, label = "position"): void {
  if (!isValidLatLng(position)) {
    throw new Error(
      `Invalid ${label}: expected [latitude, longitude] within valid world bounds.`,
    );
  }
}

export function normalizeLongitude(longitude: number): number {
  if (!Number.isFinite(longitude)) {
    return longitude;
  }

  return ((((longitude + 180) % 360) + 360) % 360) - 180;
}

export function clampLatitude(latitude: number): number {
  return Math.min(90, Math.max(-90, latitude));
}

export function roundCoordinate(value: number, precision = 6): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function roundLatLng(position: LatLng, precision = 6): LatLng {
  return [
    roundCoordinate(position[0], precision),
    roundCoordinate(position[1], precision),
  ];
}
