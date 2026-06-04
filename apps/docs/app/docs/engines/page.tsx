import { CodeBlock } from "../../code-block";
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
      <section className="doc-hero">
        <p className="eyebrow">Engines</p>
        <h1>One React API across the map engines teams already use.</h1>
        <p>
          Choose the renderer based on product requirements. Map Kit keeps the React surface stable
          while each adapter owns engine-specific details.
        </p>
      </section>
      <section className="section compact-section">
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
      <section className="component-directory two-column">
        {engineCommands.map(([name, command]) => (
          <article className="doc-card" key={name}>
            <h2>{name}</h2>
            <CodeBlock code={command} label={`${name} install`} />
          </article>
        ))}
      </section>
    </main>
  );
}
