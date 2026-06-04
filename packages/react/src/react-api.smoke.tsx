import { Circle, FitBounds, Map, MapControls, Marker, Polygon, Popup, Route, Tooltip } from "./index";
import type { LatLng } from "@map-kit/core";

const delhi: LatLng = [28.6139, 77.209];
const gurugram: LatLng = [28.4595, 77.0266];
const noida: LatLng = [28.5355, 77.391];

export function ReactApiSmoke() {
  return (
    <Map engine="leaflet" center={delhi} zoom={10}>
      <FitBounds bounds={[gurugram, noida]} />
      <MapControls position="top-left" fullscreen reset={{ center: delhi, zoom: 10 }} />
      <Marker id="delhi" position={delhi} title="New Delhi" label="DL" variant="badge">
        <Popup maxWidth={260}>Popup text</Popup>
        <Tooltip>Tooltip text</Tooltip>
      </Marker>
      <Route id="route" coordinates={[gurugram, delhi, noida]} />
      <Circle id="circle" center={delhi} radius={1000} />
      <Polygon id="polygon" coordinates={[gurugram, delhi, noida]} />
    </Map>
  );
}
