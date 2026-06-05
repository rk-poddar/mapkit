import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { tocFromTitles } from "../../docs-nav";

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
    <DocsShell toc={tocFromTitles(["Component Anatomy", "Core Props", "Controller", "Adapters"])}>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">API Reference</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Shared React primitives for multiple map engines, with adapter escape hatches when you need them.</p>
        </header>

        <section className="mt-12 space-y-5 scroll-m-24" id="component-anatomy">
          <h2 className="text-2xl font-semibold tracking-tight">Component Anatomy</h2>
          <p className="docs-prose">Compose map features directly inside the map tree. Child primitives register themselves with the adapter.</p>
          <CodeBlock code={anatomy} />
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="core-props">
          <h2 className="text-2xl font-semibold tracking-tight">Core Props</h2>
          <div className="overflow-hidden rounded-lg border">
            <div className="bg-muted/30 grid grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b px-4 py-3 text-sm font-medium">
              <span>Primitive</span>
              <span>Common props</span>
              <span>Description</span>
            </div>
            {rows.map(([primitive, props, description]) => (
              <div className="grid grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b px-4 py-4 last:border-b-0" key={primitive}>
                <code className="bg-muted h-fit w-fit rounded-md px-1.5 py-0.5 text-sm">{primitive}</code>
                <span className="text-muted-foreground text-sm leading-6">{props}</span>
                <p className="text-muted-foreground text-sm leading-6">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="controller">
          <h2 className="text-2xl font-semibold tracking-tight">Controller</h2>
          <p className="docs-prose">
            The controller normalizes common imperative actions so teams can animate vehicles, fit route bounds, reset
            views, or synchronize external UI without knowing the current engine.
          </p>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="adapters">
          <h2 className="text-2xl font-semibold tracking-tight">Adapters</h2>
          <p className="docs-prose">
            Adapter packages implement the engine-specific work. Start with one adapter, then add more when your product
            genuinely needs provider choice.
          </p>
        </section>
    </DocsShell>
  );
}
