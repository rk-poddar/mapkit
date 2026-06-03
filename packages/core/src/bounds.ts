import { assertValidLatLng, isValidLatLng } from "./coordinates";
import type { LatLng, LatLngBounds } from "./types";

export function createBounds(positions: LatLng[]): LatLngBounds {
  if (positions.length === 0) {
    throw new Error("Cannot create bounds from an empty coordinate list.");
  }

  let south = Number.POSITIVE_INFINITY;
  let west = Number.POSITIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;

  for (const position of positions) {
    assertValidLatLng(position);
    const [lat, lng] = position;
    south = Math.min(south, lat);
    west = Math.min(west, lng);
    north = Math.max(north, lat);
    east = Math.max(east, lng);
  }

  return [
    [south, west],
    [north, east],
  ];
}

export function isValidBounds(bounds: LatLngBounds): boolean {
  const [southWest, northEast] = bounds;
  return (
    isValidLatLng(southWest) &&
    isValidLatLng(northEast) &&
    southWest[0] <= northEast[0] &&
    southWest[1] <= northEast[1]
  );
}

export function assertValidBounds(bounds: LatLngBounds, label = "bounds"): void {
  if (!isValidBounds(bounds)) {
    throw new Error(`Invalid ${label}: expected [[south, west], [north, east]].`);
  }
}

export function getBoundsCenter(bounds: LatLngBounds): LatLng {
  assertValidBounds(bounds);
  const [southWest, northEast] = bounds;
  return [
    (southWest[0] + northEast[0]) / 2,
    (southWest[1] + northEast[1]) / 2,
  ];
}

export function extendBounds(bounds: LatLngBounds, position: LatLng): LatLngBounds {
  assertValidBounds(bounds);
  assertValidLatLng(position);

  const [southWest, northEast] = bounds;
  return [
    [Math.min(southWest[0], position[0]), Math.min(southWest[1], position[1])],
    [Math.max(northEast[0], position[0]), Math.max(northEast[1], position[1])],
  ];
}

export function containsPosition(bounds: LatLngBounds, position: LatLng): boolean {
  assertValidBounds(bounds);
  assertValidLatLng(position);

  const [southWest, northEast] = bounds;
  return (
    position[0] >= southWest[0] &&
    position[0] <= northEast[0] &&
    position[1] >= southWest[1] &&
    position[1] <= northEast[1]
  );
}

export function padBounds(bounds: LatLngBounds, ratio = 0.1): LatLngBounds {
  assertValidBounds(bounds);

  const [southWest, northEast] = bounds;
  const latPadding = (northEast[0] - southWest[0]) * ratio;
  const lngPadding = (northEast[1] - southWest[1]) * ratio;

  return [
    [southWest[0] - latPadding, southWest[1] - lngPadding],
    [northEast[0] + latPadding, northEast[1] + lngPadding],
  ];
}
