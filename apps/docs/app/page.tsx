import { MapPreview } from "./map-preview";
import { componentDocs, engineDocs, installSteps } from "./docs-data";
import { SiteHeader } from "./site-header";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">React and Next.js map UI kit</p>
          <h1>Beautiful maps, without rebuilding map plumbing every time.</h1>
          <p className="hero-text">
            Map Kit gives product teams engine-agnostic React primitives, polished copy-paste UI
            blocks, and adapters for Leaflet, MapLibre, Google Maps, and Mapbox.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#preview">
              View preview
            </a>
            <a className="secondary-action" href="/components">
              Browse components
            </a>
          </div>
        </div>
        <div className="hero-panel" aria-label="Install command">
          <div className="terminal">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
            <code>pnpm dlx @map-kit/cli add map-controls popup-card</code>
          </div>
          <div className="hero-grid">
            <div>
              <strong>4 engines</strong>
              <span>one React API</span>
            </div>
            <div>
              <strong>CLI registry</strong>
              <span>copy app-owned UI</span>
            </div>
            <div>
              <strong>Next-ready</strong>
              <span>examples and smoke tests</span>
            </div>
          </div>
        </div>
      </section>

      <MapPreview />

      <section className="section" id="docs">
        <div className="section-heading">
          <p className="eyebrow">Quick start</p>
          <h2>From install to rendered map in minutes.</h2>
        </div>
        <div className="steps">
          {installSteps.map((step, index) => (
            <div className="step-card" key={step}>
              <span>{index + 1}</span>
              <code>{step}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="components">
        <div className="section-heading">
          <p className="eyebrow">Components</p>
          <h2>Import from the package or copy the block into your app.</h2>
        </div>
        <div className="component-grid">
          {componentDocs.map((component) => (
            <a className="component-card" href={`/components/${component.slug}`} key={component.name}>
              <span className="pill">{component.category}</span>
              <h3>{component.name}</h3>
              <p>{component.description}</p>
              <code>{component.command}</code>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="engines">
        <div className="section-heading">
          <p className="eyebrow">Engines</p>
          <h2>Pick the map engine that matches the product decision.</h2>
        </div>
        <div className="engine-table">
          {engineDocs.map(([name, label, description]) => (
            <article className="engine-row" key={name}>
              <strong>{name}</strong>
              <span>{label}</span>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section registry-section" id="registry">
        <div>
          <p className="eyebrow">Registry</p>
          <h2>Metadata first, remote-ready later.</h2>
          <p>
            The CLI now exposes a lightweight registry index plus full component payloads. That is
            the foundation for preview pages, versioned blocks, and future remote registry installs.
          </p>
        </div>
        <div className="registry-code">
          <code>map-kit registry</code>
          <code>map-kit registry map-controls</code>
          <code>map-kit add map-controls --out src/components/map-kit</code>
        </div>
      </section>
    </main>
  );
}
