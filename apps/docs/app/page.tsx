import { MapPreview } from "./map-preview";

const components = [
  {
    category: "control",
    command: "pnpm dlx @map-kit/cli add map-controls",
    description: "Zoom, fullscreen, and reset controls that can be copied into an app.",
    name: "Map Controls",
  },
  {
    category: "marker",
    command: "pnpm dlx @map-kit/cli add marker-badge",
    description: "Pin, dot, and badge marker visuals for list previews and HTML markers.",
    name: "Marker Badge",
  },
  {
    category: "overlay",
    command: "pnpm dlx @map-kit/cli add popup-card",
    description: "A compact overlay card for popups and contextual map content.",
    name: "Popup Card",
  },
  {
    category: "overlay",
    command: "pnpm dlx @map-kit/cli add map-legend",
    description: "Route and layer legends designed to sit cleanly above maps.",
    name: "Map Legend",
  },
];

const engines = [
  ["Leaflet", "Fast setup", "Best for admin panels, logistics tools, and OSM-first apps."],
  ["MapLibre", "Open WebGL", "Best for vector tiles, styling control, and open-source map stacks."],
  ["Mapbox", "Managed WebGL", "Best when teams already use Mapbox styles, tokens, and services."],
  ["Google Maps", "Coverage", "Best when Google Places, traffic, or familiar business maps matter."],
];

const installSteps = [
  "pnpm add @map-kit/react @map-kit/leaflet leaflet",
  "pnpm dlx @map-kit/cli add map-controls popup-card",
  "import { Map, Marker, Route } from \"@map-kit/react\";",
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Map Kit home">
          <span className="brand-mark">M</span>
          Map Kit
        </a>
        <nav aria-label="Primary navigation">
          <a href="#docs">Docs</a>
          <a href="#components">Components</a>
          <a href="#engines">Engines</a>
          <a href="#registry">Registry</a>
        </nav>
      </header>

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
            <a className="secondary-action" href="#components">
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
          {components.map((component) => (
            <article className="component-card" key={component.name}>
              <span className="pill">{component.category}</span>
              <h3>{component.name}</h3>
              <p>{component.description}</p>
              <code>{component.command}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="engines">
        <div className="section-heading">
          <p className="eyebrow">Engines</p>
          <h2>Pick the map engine that matches the product decision.</h2>
        </div>
        <div className="engine-table">
          {engines.map(([name, label, description]) => (
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
