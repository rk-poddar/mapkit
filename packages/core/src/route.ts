import { createBounds } from "./bounds";
import { getDistanceMeters, getRouteDistanceMeters, interpolatePosition } from "./distance";
import type { LatLng, LatLngBounds } from "./types";

export type RouteProgress = {
  distanceMeters: number;
  totalDistanceMeters: number;
  progress: number;
  position: LatLng;
  segmentIndex: number;
  segmentStartDistanceMeters: number;
  segmentEndDistanceMeters: number;
};

export function getRouteBounds(coordinates: LatLng[]): LatLngBounds {
  return createBounds(coordinates);
}

export function getRouteProgressAtDistance(
  coordinates: LatLng[],
  distanceMeters: number,
): RouteProgress {
  if (coordinates.length === 0) {
    throw new Error("Cannot calculate route progress for an empty route.");
  }

  if (coordinates.length === 1) {
    return {
      distanceMeters: 0,
      totalDistanceMeters: 0,
      progress: 1,
      position: coordinates[0],
      segmentIndex: 0,
      segmentStartDistanceMeters: 0,
      segmentEndDistanceMeters: 0,
    };
  }

  const totalDistanceMeters = getRouteDistanceMeters(coordinates);

  if (totalDistanceMeters === 0) {
    return {
      distanceMeters: 0,
      totalDistanceMeters,
      progress: 1,
      position: coordinates[coordinates.length - 1],
      segmentIndex: coordinates.length - 2,
      segmentStartDistanceMeters: 0,
      segmentEndDistanceMeters: 0,
    };
  }

  const safeDistance = Math.min(Math.max(distanceMeters, 0), totalDistanceMeters);
  let traversedDistance = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const from = coordinates[index - 1];
    const to = coordinates[index];
    const segmentDistance = getDistanceMeters(from, to);
    const nextDistance = traversedDistance + segmentDistance;

    if (safeDistance <= nextDistance || index === coordinates.length - 1) {
      const segmentProgress =
        segmentDistance === 0 ? 1 : (safeDistance - traversedDistance) / segmentDistance;

      return {
        distanceMeters: safeDistance,
        totalDistanceMeters,
        progress: safeDistance / totalDistanceMeters,
        position: interpolatePosition(from, to, segmentProgress),
        segmentIndex: index - 1,
        segmentStartDistanceMeters: traversedDistance,
        segmentEndDistanceMeters: nextDistance,
      };
    }

    traversedDistance = nextDistance;
  }

  return {
    distanceMeters: totalDistanceMeters,
    totalDistanceMeters,
    progress: 1,
    position: coordinates[coordinates.length - 1],
    segmentIndex: coordinates.length - 2,
    segmentStartDistanceMeters: totalDistanceMeters,
    segmentEndDistanceMeters: totalDistanceMeters,
  };
}

export function getRouteProgressAtPercent(
  coordinates: LatLng[],
  progress: number,
): RouteProgress {
  const totalDistanceMeters = getRouteDistanceMeters(coordinates);
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  return getRouteProgressAtDistance(coordinates, totalDistanceMeters * safeProgress);
}

export function splitRouteAtDistance(
  coordinates: LatLng[],
  distanceMeters: number,
): { traversed: LatLng[]; remaining: LatLng[] } {
  const routeProgress = getRouteProgressAtDistance(coordinates, distanceMeters);
  const splitPosition = routeProgress.position;
  const splitIndex = routeProgress.segmentIndex;

  return {
    traversed: [...coordinates.slice(0, splitIndex + 1), splitPosition],
    remaining: [splitPosition, ...coordinates.slice(splitIndex + 1)],
  };
}
