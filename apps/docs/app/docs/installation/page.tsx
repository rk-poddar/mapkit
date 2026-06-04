import { installSteps } from "../../docs-data";
import { SiteHeader } from "../../site-header";

const snippets = [
  {
    title: "Leaflet provider",
    code: `import { leafletAdapter } from "@map-kit/leaflet";
import { Map, Marker } from "@map-kit/react";

<Map adapter={leafletAdapter} engine="leaflet" provider="osm" center={[28.6139, 77.209]} zoom={10}>
  <Marker id="delhi" position={[28.6139, 77.209]} title="Delhi hub" />
</Map>`,
  },
  {
    title: "Copy UI blocks",
    code: `pnpm dlx @map-kit/cli add map-controls popup-card marker-badge map-legend --out src/components/map-kit`,
  },
];

export default function InstallationPage() {
  return (
    <main>
      <SiteHeader />
      <section className="doc-hero">
        <p className="eyebrow">Docs</p>
        <h1>Install Map Kit and render your first map.</h1>
        <p>
          Start with a map engine adapter, then add React primitives and copy-paste UI blocks when
          your app needs product-ready controls.
        </p>
      </section>
      <section className="docs-layout">
        <aside className="docs-sidebar">
          <a href="/docs/installation">Installation</a>
          <a href="/docs/engines">Engines</a>
          <a href="/docs/registry">Registry</a>
          <a href="/components">Components</a>
        </aside>
        <div className="docs-content">
          <article className="doc-card">
            <h2>Quick start</h2>
            <div className="steps vertical">
              {installSteps.map((step, index) => (
                <div className="step-card" key={step}>
                  <span>{index + 1}</span>
                  <code>{step}</code>
                </div>
              ))}
            </div>
          </article>
          {snippets.map((snippet) => (
            <article className="doc-card" key={snippet.title}>
              <h2>{snippet.title}</h2>
              <pre>
                <code>{snippet.code}</code>
              </pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
