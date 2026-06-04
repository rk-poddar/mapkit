import { ComponentPreview } from "./component-preview";
import { componentDocs } from "../docs-data";
import { SiteHeader } from "../site-header";

export default function ComponentsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="doc-hero">
        <p className="eyebrow">Components</p>
        <h1>Copy-paste map UI blocks for real product surfaces.</h1>
        <p>
          Start with packaged components or install editable app-owned files through the CLI
          registry.
        </p>
      </section>
      <section className="component-directory">
        {componentDocs.map((component) => (
          <a className="component-list-card" href={`/components/${component.slug}`} key={component.slug}>
            <ComponentPreview component={component} />
            <span className="pill">{component.category}</span>
            <h2>{component.name}</h2>
            <p>{component.description}</p>
            <code>{component.command}</code>
          </a>
        ))}
      </section>
    </main>
  );
}
