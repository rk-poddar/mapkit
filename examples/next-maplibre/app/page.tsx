"use client";

import { mapLibreAdapter } from "@map-kit/maplibre";
import { Circle, FitBounds, Map, Marker, Polygon, Popup, Route } from "@map-kit/react";
import { useState } from "react";

const delhi = [28.6139, 77.209] as const;
const gurugram = [28.4595, 77.0266] as const;
const noida = [28.5355, 77.391] as const;
const faridabad = [28.4089, 77.3178] as const;

const route = [gurugram, delhi, noida];
const alternateRoute = [gurugram, faridabad, noida];
const polygon = [gurugram, delhi, noida, faridabad];

export default function HomePage() {
  const [showRoute, setShowRoute] = useState(true);
  const [showCircle, setShowCircle] = useState(true);
  const [showPolygon, setShowPolygon] = useState(true);
  const [useAlternateRoute, setUseAlternateRoute] = useState(false);

  return (
    <main className="page-shell">
      <section className="map-panel">
        <div className="map-toolbar">
          <button onClick={() => setShowRoute((value) => !value)}>
            {showRoute ? "Hide" : "Show"} route
          </button>
          <button onClick={() => setUseAlternateRoute((value) => !value)}>Update route</button>
          <button onClick={() => setShowCircle((value) => !value)}>
            {showCircle ? "Hide" : "Show"} circle
          </button>
          <button onClick={() => setShowPolygon((value) => !value)}>
            {showPolygon ? "Hide" : "Show"} polygon
          </button>
        </div>
        <Map
          adapter={mapLibreAdapter}
          className="map-canvas"
          engine="maplibre"
          provider="osm"
          center={delhi}
          zoom={9}
        >
          <FitBounds bounds={[gurugram, noida]} options={{ padding: 48 }} />
          {showRoute ? (
            <Route
              id="ncr-route"
              coordinates={useAlternateRoute ? alternateRoute : route}
              color={useAlternateRoute ? "#7c3aed" : "#2563eb"}
              width={5}
            />
          ) : null}
          {showCircle ? (
            <Circle
              id="delhi-service-area"
              center={delhi}
              radius={9000}
              color="#0f766e"
              fillColor="#14b8a6"
              fillOpacity={0.18}
            />
          ) : null}
          {showPolygon ? (
            <Polygon
              id="ncr-polygon"
              coordinates={polygon}
              color="#f97316"
              fillColor="#fb923c"
              fillOpacity={0.16}
            />
          ) : null}
          <Marker id="delhi" position={delhi} title="New Delhi" color="#2563eb">
            <Popup>MapLibre marker rendered by Map Kit.</Popup>
          </Marker>
          <Marker id="gurugram" position={gurugram} title="Gurugram" color="#0f766e" />
          <Marker id="noida" position={noida} title="Noida" color="#dc2626" />
        </Map>
      </section>
    </main>
  );
}
