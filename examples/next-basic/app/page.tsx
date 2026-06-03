"use client";

import { leafletAdapter } from "@map-kit/leaflet";
import { Circle, FitBounds, Map, Marker, Route } from "@map-kit/react";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;

const route = [gurugram, delhi, noida];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="map-panel">
        <Map
          adapter={leafletAdapter}
          className="map-canvas"
          engine="leaflet"
          provider="osm"
          center={delhi}
          zoom={10}
        >
          <FitBounds bounds={[gurugram, noida]} options={{ padding: 40 }} />
          <Route id="ncr-route" coordinates={route} color="#2563eb" width={5} />
          <Circle
            id="delhi-service-area"
            center={delhi}
            radius={7000}
            color="#0f766e"
            fillColor="#14b8a6"
            fillOpacity={0.18}
          />
          <Marker
            id="delhi"
            position={delhi}
            title="New Delhi"
            description="Map Kit Leaflet marker"
          />
          <Marker id="gurugram" position={gurugram} title="Gurugram" />
          <Marker id="noida" position={noida} title="Noida" />
        </Map>
      </section>
    </main>
  );
}
