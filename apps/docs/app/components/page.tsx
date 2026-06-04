import { ComponentPreview } from "./component-preview";
import { DocsShell } from "../docs-shell";
import { componentDocs } from "../docs-data";
import { SiteHeader } from "../site-header";

export default function ComponentsPage() {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={["Components"]}>
        <header className="docs-page-header">
          <h1>Components</h1>
          <p>Copy-paste map UI blocks for real product surfaces.</p>
        </header>
        <section className="docs-prose-section" id="components">
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
