import { assertValidLatLng } from "./coordinates";
import type { LatLng } from "./types";

export const EARTH_RADIUS_METERS = 6_371_008.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function getDistanceMeters(from: LatLng, to: LatLng): number {
  assertValidLatLng(from, "from");
  assertValidLatLng(to, "to");

  const fromLat = toRadians(from[0]);
  const toLat = toRadians(to[0]);
  const deltaLat = toRadians(to[0] - from[0]);
  const deltaLng = toRadians(to[1] - from[1]);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getRouteDistanceMeters(coordinates: LatLng[]): number {
  if (coordinates.length < 2) {
    return 0;
  }

  return coordinates.reduce((total, coordinate, index) => {
    if (index === 0) {
      return total;
    }

    return total + getDistanceMeters(coordinates[index - 1], coordinate);
  }, 0);
}

export function interpolatePosition(from: LatLng, to: LatLng, fraction: number): LatLng {
  assertValidLatLng(from, "from");
  assertValidLatLng(to, "to");

  const safeFraction = Math.min(1, Math.max(0, fraction));
  return [
    from[0] + (to[0] - from[0]) * safeFraction,
    from[1] + (to[1] - from[1]) * safeFraction,
  ];
}

export function formatDistance(
  meters: number,
  options: { precision?: number; unit?: "auto" | "m" | "km" } = {},
): string {
  const { precision = 1, unit = "auto" } = options;

  if (unit === "m" || (unit === "auto" && Math.abs(meters) < 1000)) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(precision)} km`;
}
