"use client";

import { leafletAdapter } from "@map-kit/leaflet";
import { Circle, FitBounds, Map, MapControls, Marker, Popup, Route, Tooltip } from "@map-kit/react";
import { useState } from "react";

const delhi = [28.6139, 77.209] as const;
const jaipur = [26.9124, 75.7873] as const;
const agra = [27.1767, 78.0081] as const;
const gurugram = [28.4595, 77.0266] as const;

const primaryRoute = [jaipur, gurugram, delhi, agra];
const fastRoute = [jaipur, delhi, agra];

export function MapPreview() {
  const [showRadius, setShowRadius] = useState(true);
  const [routeMode, setRouteMode] = useState<"planned" | "actual">("actual");

  return (
    <section className="preview-shell" id="preview">
      <div className="preview-header">
        <div>
          <p className="eyebrow">Live preview</p>
          <h2>Declarative map UI with real engine adapters.</h2>
        </div>
        <div className="preview-actions" aria-label="Preview controls">
          <button
            className={routeMode === "actual" ? "active" : ""}
            onClick={() => setRouteMode("actual")}
            type="button"
          >
            Actual
          </button>
          <button
            className={routeMode === "planned" ? "active" : ""}
            onClick={() => setRouteMode("planned")}
            type="button"
          >
            Planned
          </button>
          <button onClick={() => setShowRadius((value) => !value)} type="button">
            {showRadius ? "Hide" : "Show"} radius
          </button>
        </div>
      </div>
      <div className="map-frame">
        <Map
          adapter={leafletAdapter}
          center={delhi}
          className="docs-map"
          controls={{ zoom: false }}
          engine="leaflet"
          provider="osm"
          zoom={6}
        >
          <MapControls position="top-right" fullscreen reset={{ center: delhi, zoom: 6 }} />
          <FitBounds bounds={[jaipur, agra]} options={{ padding: 52 }} />
          <Route
            color={routeMode === "actual" ? "#2563eb" : "#64748b"}
            coordinates={routeMode === "actual" ? primaryRoute : fastRoute}
            id="docs-route"
            width={5}
          />
          {showRadius ? (
            <Circle
              center={delhi}
              color="#0f766e"
              fillColor="#14b8a6"
              fillOpacity={0.16}
              id="docs-service-radius"
              radius={52000}
            />
          ) : null}
          <Marker color="#2563eb" id="delhi" label="DL" position={delhi} title="Delhi hub" variant="badge">
            <Popup maxWidth={260}>Central hub with popup and tooltip primitives.</Popup>
            <Tooltip>Delhi hub</Tooltip>
          </Marker>
          <Marker color="#f97316" id="jaipur" label="JP" position={jaipur} title="Jaipur pickup" variant="pin" />
          <Marker color="#dc2626" id="agra" label="AG" position={agra} title="Agra drop" variant="dot" />
        </Map>
        <div className="legend-card" aria-label="Map legend">
          <span>
            <i className="route route-blue" />
            Actual route
          </span>
          <span>
            <i className="route route-gray" />
            Planned route
          </span>
          <span>
            <i className="area" />
            Service radius
          </span>
        </div>
      </div>
    </section>
  );
}
