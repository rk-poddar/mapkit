import { describe, expect, it } from "vitest";
import {
  containsPosition,
  createBounds,
  getDistanceMeters,
  getRouteProgressAtPercent,
  normalizeProviderConfig,
  splitRouteAtDistance,
  toLatLng,
  toLngLat,
  validateProviderConfig,
} from "./index";
import type { LatLng } from "./types";

const delhi: LatLng = [28.6139, 77.209];
const mumbai: LatLng = [19.076, 72.8777];
const jaipur: LatLng = [26.9124, 75.7873];

describe("@map-kit/core", () => {
  it("converts coordinates between LatLng and LngLat", () => {
    expect(toLatLng(toLngLat(delhi))).toEqual(delhi);
  });

  it("creates bounds that contain included positions", () => {
    const bounds = createBounds([delhi, mumbai, jaipur]);

    expect(containsPosition(bounds, delhi)).toBe(true);
  });

  it("calculates positive distance and route progress", () => {
    const distance = getDistanceMeters(delhi, mumbai);
    const route = [mumbai, jaipur, delhi];
    const progress = getRouteProgressAtPercent(route, 0.5);
    const split = splitRouteAtDistance(route, progress.distanceMeters);

    expect(distance).toBeGreaterThan(0);
    expect(progress.progress).toBeGreaterThanOrEqual(0);
    expect(progress.progress).toBeLessThanOrEqual(1);
    expect(split.traversed.length).toBeGreaterThan(0);
    expect(split.remaining.length).toBeGreaterThan(0);
  });

  it("normalizes provider attribution and validates missing keys", () => {
    expect(normalizeProviderConfig({ provider: "osm" }).attribution).toBeTruthy();
    expect(validateProviderConfig({ provider: "google" }, { engine: "google-maps" })).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing-api-key" })]),
    );
  });
});
