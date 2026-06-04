import { MapPreview } from "./map-preview";
import { componentDocs, engineDocs, installSteps } from "./docs-data";
import { SiteHeader } from "./site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="top">
        <div className="hero-copy">
          <h1>Beautiful maps, made simple</h1>
          <p className="hero-text">
            Ready-to-use, customizable map components for React and Next.js. Built for multiple
            engines, styled with shadcn-inspired patterns.
          </p>
          <div className="hero-actions">
            <Button asChild className="primary-action">
              <a href="#preview">Get Started</a>
            </Button>
            <Button asChild className="secondary-action" variant="outline">
              <a href="/components">View Components</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="showcase-grid" aria-label="Map component previews">
        <article className="showcase-card showcase-card-wide">
          <div className="world-map-preview">
            <div className="stats-card">
              <span>Active users</span>
              <strong>2,847</strong>
              <small>+12.5% vs last hour</small>
            </div>
            <span className="map-dot dot-one" />
            <span className="map-dot dot-two" />
            <span className="map-dot dot-three" />
            <strong className="continent-label label-one">North America</strong>
            <strong className="continent-label label-two">Europe</strong>
            <strong className="continent-label label-three">Asia</strong>
          </div>
        </article>
        <article className="showcase-card">
          <div className="route-preview">
            <div className="route-metric-card">
              <strong>Central Park Loop</strong>
              <span>6.2 mi · 32 min · 285 cal</span>
            </div>
            <svg viewBox="0 0 280 300" aria-hidden="true">
              <path d="M120 10 L215 58 L185 112 L230 145 L144 276 L76 240 L112 168 L76 132 Z" />
              <circle cx="120" cy="10" r="8" />
            </svg>
          </div>
        </article>
        <article className="showcase-card">
          <div className="globe-preview">
            <button aria-label="Locate preview" type="button">
              ↗
            </button>
            <div className="globe" />
          </div>
        </article>
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
              <Badge className="pill" variant="secondary">
                {component.category}
              </Badge>
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
