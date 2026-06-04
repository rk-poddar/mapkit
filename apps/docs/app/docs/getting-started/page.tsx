import { DocsShell } from "../../docs-shell";
import { SiteHeader } from "../../site-header";

export default function GettingStartedPage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={["Philosophy", "Why Map Kit", "Any Map Engine", "Features"]}>
        <header className="docs-page-header">
          <h1>Introduction</h1>
          <p>Copy-paste map components for React and Next.js, backed by adapter packages for real map engines.</p>
        </header>

        <section className="docs-prose-section" id="philosophy">
          <h2>Philosophy</h2>
          <p>
            Map Kit follows the shadcn model for maps: own the UI code you ship, keep the core primitives small, and
            choose the map engine that fits your product instead of locking the app to one provider.
          </p>
          <p>
            The goal is simple: maps should feel like the rest of your React system. Controls, markers, popups, routes,
            and legends should be composable, themeable, and easy to copy into an app.
          </p>
        </section>

        <section className="docs-prose-section" id="why-map-kit">
          <h2>Why Map Kit</h2>
          <ul className="docs-list">
            <li>
              <strong>Own your code:</strong> copy polished UI blocks into your project and customize them without
              waiting on package releases.
            </li>
            <li>
              <strong>Start fast:</strong> render a production-friendly map with one React API and a provider adapter.
            </li>
            <li>
              <strong>Scale safely:</strong> use shared primitives first, then access raw engine APIs when advanced map
              behavior needs them.
            </li>
          </ul>
        </section>

        <section className="docs-prose-section" id="any-map-engine">
          <h2>Any Map Engine</h2>
          <p>
            The public API is designed around shared map concepts: center, zoom, markers, popups, routes, circles, and
            controls. Leaflet, MapLibre, Mapbox, and Google Maps adapters translate those concepts into native engine
            behavior.
          </p>
          <div className="engine-matrix">
            <span>Leaflet</span>
            <span>MapLibre</span>
            <span>Mapbox</span>
            <span>Google Maps</span>
          </div>
        </section>

        <section className="docs-prose-section" id="features">
          <h2>Features</h2>
          <div className="feature-grid">
            <article>
              <h3>React primitives</h3>
              <p>Map, Marker, Popup, Tooltip, Route, Circle, FitBounds, and map controller hooks.</p>
            </article>
            <article>
              <h3>Copy-paste blocks</h3>
              <p>Controls, marker badges, popup cards, and legends that match app UI instead of engine chrome.</p>
            </article>
            <article>
              <h3>Registry ready</h3>
              <p>CLI metadata and source files are structured so docs previews and install commands stay connected.</p>
            </article>
          </div>
        </section>
      </DocsShell>
    </main>
  );
}
