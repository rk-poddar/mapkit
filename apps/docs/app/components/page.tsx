import { ComponentPreview } from "./component-preview";
import { DocsShell } from "../docs-shell";
import { componentDocs, componentGuides } from "../docs-data";
import { SiteHeader } from "../site-header";

export default function ComponentsPage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={["Primitives", "Blocks"]}>
        <header className="docs-page-header">
          <h1>Components</h1>
          <p>Map primitives and copy-paste UI blocks for real product surfaces.</p>
        </header>
        <section className="docs-prose-section" id="primitives">
          <h2>Primitives</h2>
          <div className="component-guide-grid">
            {componentGuides.map((component) => (
              <a className="component-guide-card" href={`/components/${component.slug}`} key={component.slug}>
                <span>{component.name}</span>
                <p>{component.description}</p>
              </a>
            ))}
          </div>
        </section>
        <section className="docs-prose-section" id="blocks">
          <h2>Blocks</h2>
          <div className="component-directory">
            {componentDocs.map((component) => (
              <a className="component-list-card" href={`/components/${component.slug}`} key={component.slug}>
                <ComponentPreview component={component} />
                <span className="pill">{component.category}</span>
                <h2>{component.name}</h2>
                <p>{component.description}</p>
                <code>{component.command}</code>
              </a>
            ))}
          </div>
        </section>
      </DocsShell>
    </main>
  );
}
