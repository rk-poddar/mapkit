import { notFound } from "next/navigation";
import { CodeBlock } from "../../code-block";
import { ComponentPreview } from "../component-preview";
import { componentDocs, getComponentDoc } from "../../docs-data";
import { SiteHeader } from "../../site-header";

export function generateStaticParams() {
  return componentDocs.map((component) => ({ slug: component.slug }));
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentDoc(slug);

  if (!component) {
    notFound();
  }

  return (
    <main>
      <SiteHeader />
      <section className="doc-hero detail-hero">
        <div>
          <p className="eyebrow">{component.category}</p>
          <h1>{component.name}</h1>
          <p>{component.description}</p>
        </div>
        <ComponentPreview component={component} />
      </section>
      <section className="detail-layout">
        <aside className="detail-aside">
          <span className="pill">Install</span>
          <CodeBlock code={component.command} label="Install command" />
          <span className="pill">File</span>
          <code>{component.fileName}</code>
          <span className="pill">Tags</span>
          <div className="tag-list">
            {component.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </aside>
        <div className="detail-main">
          <article className="doc-card">
            <h2>Usage</h2>
            <CodeBlock code={component.usage} label="Usage" />
          </article>
          <article className="doc-card">
            <h2>Source preview</h2>
            <CodeBlock code={component.source} label={component.fileName} />
          </article>
        </div>
      </section>
    </main>
  );
}
