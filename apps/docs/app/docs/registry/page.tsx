import { CodeBlock } from "../../code-block";
import { componentDocs } from "../../docs-data";
import { SiteHeader } from "../../site-header";

const registryPayload = `{
  "name": "@map-kit/registry",
  "schemaVersion": "0.1.0",
  "items": [
    {
      "name": "map-controls",
      "title": "Map Controls",
      "category": "control",
      "files": [{ "path": "map-controls.tsx", "type": "registry:component" }]
    }
  ]
}`;

export default function RegistryPage() {
  return (
    <main>
      <SiteHeader />
      <section className="doc-hero">
        <p className="eyebrow">Registry</p>
        <h1>Component metadata that powers install, preview, and future remote registry flows.</h1>
        <p>
          The CLI exposes a lightweight index for docs and search, plus full item payloads for source
          installation.
        </p>
      </section>
      <section className="detail-layout">
        <aside className="detail-aside">
          <span className="pill">Commands</span>
          <code>map-kit registry</code>
          <code>map-kit registry map-controls</code>
          <code>map-kit add map-controls</code>
        </aside>
        <div className="detail-main">
          <article className="doc-card">
            <h2>Index payload</h2>
            <CodeBlock code={registryPayload} label="registry.json" />
          </article>
          <article className="doc-card">
            <h2>Current registry items</h2>
            <div className="registry-list">
              {componentDocs.map((component) => (
                <a href={`/components/${component.slug}`} key={component.slug}>
                  <strong>{component.name}</strong>
                  <span>{component.category}</span>
                  <code>{component.fileName}</code>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
