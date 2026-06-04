import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
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
      <DocsShell toc={["Prerequisites", "Installation", "Usage"]}>
        <header className="docs-page-header">
          <h1>Installation</h1>
          <p>How to install and set up Map Kit in your project.</p>
        </header>

        <section className="docs-prose-section" id="prerequisites">
          <h2>Prerequisites</h2>
          <p>A React or Next.js project. Tailwind and shadcn/ui patterns are recommended for copied UI blocks.</p>
        </section>

        <section className="docs-prose-section" id="installation">
          <h2>Installation</h2>
          <p>Start with the React primitives and one map engine adapter:</p>
          <div className="steps vertical">
            {installSteps.map((step, index) => (
              <div className="step-card" key={step}>
                <span>{index + 1}</span>
                <code>{step}</code>
              </div>
            ))}
          </div>
        </section>

        <section className="docs-prose-section" id="usage">
          <h2>Usage</h2>
          {snippets.map((snippet) => (
            <article className="doc-card" key={snippet.title}>
              <h3>{snippet.title}</h3>
              <CodeBlock code={snippet.code} label={snippet.title} />
            </article>
          ))}
        </section>
      </DocsShell>
    </main>
  );
}
