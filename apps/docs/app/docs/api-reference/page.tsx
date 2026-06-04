import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { SiteHeader } from "../../site-header";

const anatomy = `<Map adapter={leafletAdapter} center={[28.6139, 77.209]} zoom={10}>
  <MapControls position="top-right" />
  <Marker id="hub-delhi" position={[28.6139, 77.209]}>
    <Popup>Delhi hub</Popup>
    <Tooltip>Primary hub</Tooltip>
  </Marker>
  <Route id="actual-route" coordinates={actualPath} />
  <Circle id="geofence" center={[28.6139, 77.209]} radius={500} />
</Map>`;

const rows = [
  ["Map", "adapter, center, zoom, viewport, children", "Creates the engine instance and React map context."],
  ["Marker", "id, position, title, draggable, children", "Places engine-backed or custom React marker content."],
  ["Popup", "position, offset, children", "Renders contextual content tied to a map coordinate or marker."],
  ["Route", "id, coordinates, color, width, dashed", "Draws polyline paths for planned, actual, or remaining routes."],
  ["FitBounds", "bounds, padding, maxZoom", "Moves the map to show a route, geofence, or set of points."],
  ["useMap", "controller", "Accesses imperative APIs like flyTo, fitBounds, and engine instance reads."],
] as const;

export default function ApiReferencePage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={["Component Anatomy", "Core Props", "Controller", "Adapters"]}>
        <header className="docs-page-header">
          <h1>API Reference</h1>
          <p>Shared React primitives for multiple map engines, with adapter escape hatches when you need them.</p>
        </header>

        <section className="docs-prose-section" id="component-anatomy">
          <h2>Component Anatomy</h2>
          <p>Compose map features directly inside the map tree. Child primitives register themselves with the adapter.</p>
          <CodeBlock code={anatomy} label="Anatomy" />
        </section>

        <section className="docs-prose-section" id="core-props">
          <h2>Core Props</h2>
          <div className="props-table" role="table" aria-label="Map Kit core props">
            <div role="row">
              <strong>Primitive</strong>
              <strong>Common props</strong>
              <strong>Description</strong>
            </div>
            {rows.map(([primitive, props, description]) => (
              <div role="row" key={primitive}>
                <code>{primitive}</code>
                <span>{props}</span>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="docs-prose-section" id="controller">
          <h2>Controller</h2>
          <p>
            The controller normalizes common imperative actions so teams can animate vehicles, fit route bounds, reset
            views, or synchronize external UI without knowing the current engine.
          </p>
        </section>

        <section className="docs-prose-section" id="adapters">
          <h2>Adapters</h2>
          <p>
            Adapter packages implement the engine-specific work. Start with one adapter, then add more when your product
            genuinely needs provider choice.
          </p>
        </section>
      </DocsShell>
    </main>
  );
}
