"use client";

import type { LatLng } from "@map-kit/core";
import { Route } from "@map-kit/react";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { ExampleCard } from "./example-card";
import { HtmlMarker } from "./html-marker";
import { ShowcaseMap } from "./showcase-map";

const store: LatLng = [51.5154, -0.14];
const home: LatLng = [51.51, -0.07];

const fallbackRoute: LatLng[] = [
  store,
  [51.5142, -0.128],
  [51.5134, -0.116],
  [51.5122, -0.105],
  [51.5112, -0.088],
  home,
];

export function DeliveryExample() {
  const [route, setRoute] = useState<LatLng[]>([]);
  const [truckPosition, setTruckPosition] = useState<LatLng | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${store[1]},${store[0]};${home[1]},${home[0]}?overview=full&geometries=geojson`,
        );
        const data = await response.json();
        const coordinates = data.routes?.[0]?.geometry?.coordinates as [number, number][] | undefined;

        if (!coordinates?.length) {
          setRoute(fallbackRoute);
          setTruckPosition(fallbackRoute[Math.floor(fallbackRoute.length * 0.6)] ?? null);
          return;
        }

        const nextRoute = coordinates.map(([lng, lat]) => [lat, lng] as LatLng);
        setRoute(nextRoute);
        setTruckPosition(nextRoute[Math.floor(nextRoute.length * 0.6)] ?? null);
      } catch {
        setRoute(fallbackRoute);
        setTruckPosition(fallbackRoute[Math.floor(fallbackRoute.length * 0.6)] ?? null);
      }
    };

    void fetchRoute();
  }, []);

  return (
    <ExampleCard className="aspect-square sm:col-span-2 sm:aspect-video lg:aspect-auto" stagger={9}>
      <ShowcaseMap center={[51.511, -0.105]} zoom={12.4}>
        {route.length > 0 ? (
          <Route color="#4285F4" coordinates={route} id="london-delivery-route" width={4} />
        ) : null}
        <HtmlMarker anchor="bottom" position={store}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="size-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-lg" />
            <span className="text-[10px] font-medium text-white drop-shadow-sm">Store</span>
          </div>
        </HtmlMarker>
        {truckPosition ? (
          <HtmlMarker position={truckPosition}>
            <div className="rounded-full bg-blue-500 p-1.5 shadow-lg">
              <Truck className="size-3 text-white" />
            </div>
          </HtmlMarker>
        ) : null}
        <HtmlMarker anchor="bottom" position={home}>
          <div className="flex flex-col items-center gap-0.5">
            <div className="size-3.5 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
            <span className="text-[10px] font-medium text-white drop-shadow-sm">Home</span>
          </div>
        </HtmlMarker>
      </ShowcaseMap>
    </ExampleCard>
  );
}
