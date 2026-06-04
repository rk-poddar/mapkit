import type { GoogleMapsProviderOptions } from "./provider";

const loaderPromiseByKey = new Map<string, Promise<typeof google.maps>>();

export function loadGoogleMaps(options: GoogleMapsProviderOptions): Promise<typeof google.maps> {
  const cacheKey = [options.apiKey, options.language ?? "", options.region ?? ""].join(":");
  const existingPromise = loaderPromiseByKey.get(cacheKey);

  if (existingPromise) {
    return existingPromise;
  }

  const promise = import("@googlemaps/js-api-loader").then(async ({ importLibrary, setOptions }) => {
    setOptions({
      key: options.apiKey,
      language: options.language,
      region: options.region,
      v: "weekly",
    });
    await Promise.all([importLibrary("maps"), importLibrary("marker")]);

    return google.maps;
  });
  loaderPromiseByKey.set(cacheKey, promise);

  return promise;
}
