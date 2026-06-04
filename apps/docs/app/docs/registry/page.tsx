import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
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
      <DocsShell toc={["Commands", "Index Payload", "Registry Items"]}>
        <header className="docs-page-header">
          <h1>Blocks Registry</h1>
          <p>Component metadata that powers install, preview, and future remote registry flows.</p>
        </header>
        <section className="docs-prose-section" id="commands">
          <h2>Commands</h2>
          <div className="registry-code">
            <code>map-kit registry</code>
            <code>map-kit registry map-controls</code>
            <code>map-kit add map-controls</code>
          </div>
        </section>
        <section className="docs-prose-section" id="index-payload">
          <h2>Index Payload</h2>
          <CodeBlock code={registryPayload} label="registry.json" />
        </section>
        <section className="docs-prose-section" id="registry-items">
          <h2>Registry Items</h2>
          <div className="registry-list">
            {componentDocs.map((component) => (
              <a href={`/components/${component.slug}`} key={component.slug}>
                <strong>{component.name}</strong>
                <span>{component.category}</span>
                <code>{component.fileName}</code>
              </a>
            ))}
          </div>
        </section>
      </DocsShell>
    </main>
  );
}
