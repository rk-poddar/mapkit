import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { engineDocs } from "../../docs-data";
import { SiteHeader } from "../../site-header";

const engineCommands = [
  ["Leaflet", "pnpm add @map-kit/leaflet leaflet"],
  ["MapLibre", "pnpm add @map-kit/maplibre maplibre-gl"],
  ["Mapbox", "pnpm add @map-kit/mapbox mapbox-gl"],
  ["Google Maps", "pnpm add @map-kit/google-maps"],
] as const;

export default function EnginesPage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={["Choosing Engines", "Install Commands"]}>
        <header className="docs-page-header">
          <h1>Engines</h1>
          <p>One React API across the map engines teams already use.</p>
        </header>
        <section className="docs-prose-section" id="choosing-engines">
          <h2>Choosing Engines</h2>
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
        <section className="docs-prose-section" id="install-commands">
          <h2>Install Commands</h2>
          <div className="two-column">
            {engineCommands.map(([name, command]) => (
              <article className="doc-card" key={name}>
                <h3>{name}</h3>
                <CodeBlock code={command} label={`${name} install`} />
              </article>
            ))}
          </div>
        </section>
      </DocsShell>
    </main>
  );
}
