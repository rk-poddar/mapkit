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

const lngLat = toLngLat(delhi);
const latLng = toLatLng(lngLat);

if (latLng[0] !== delhi[0] || latLng[1] !== delhi[1]) {
  throw new Error("Coordinate conversion smoke check failed.");
}

const bounds = createBounds([delhi, mumbai, jaipur]);
if (!containsPosition(bounds, delhi)) {
  throw new Error("Bounds smoke check failed.");
}

const distance = getDistanceMeters(delhi, mumbai);
if (distance <= 0) {
  throw new Error("Distance smoke check failed.");
}

const route = [mumbai, jaipur, delhi];
const progress = getRouteProgressAtPercent(route, 0.5);
if (progress.progress < 0 || progress.progress > 1) {
  throw new Error("Route progress smoke check failed.");
}

const split = splitRouteAtDistance(route, progress.distanceMeters);
if (split.traversed.length === 0 || split.remaining.length === 0) {
  throw new Error("Route split smoke check failed.");
}

const provider = normalizeProviderConfig({ provider: "osm" });
if (!provider.attribution) {
  throw new Error("Provider attribution smoke check failed.");
}

const providerErrors = validateProviderConfig(
  { provider: "google" },
  { engine: "google-maps" },
);
if (!providerErrors.some((error) => error.code === "missing-api-key")) {
  throw new Error("Provider validation smoke check failed.");
}
