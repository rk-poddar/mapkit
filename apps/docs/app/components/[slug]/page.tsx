import { notFound } from "next/navigation";
import { CodeBlock } from "../../code-block";
import { ComponentPreview } from "../component-preview";
import { DocsShell } from "../../docs-shell";
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
      <DocsShell toc={["Preview", "Installation", "Usage", "Source"]}>
        <header className="docs-page-header">
          <span className="pill">{component.category}</span>
          <h1>{component.name}</h1>
          <p>{component.description}</p>
        </header>
        <section className="docs-prose-section" id="preview">
          <h2>Preview</h2>
          <ComponentPreview component={component} />
        </section>
        <section className="docs-prose-section" id="installation">
          <h2>Installation</h2>
          <CodeBlock code={component.command} label="Install command" />
          <div className="detail-meta">
            <code>{component.fileName}</code>
            {component.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </section>
        <section className="docs-prose-section" id="usage">
          <h2>Usage</h2>
          <CodeBlock code={component.usage} label="Usage" />
        </section>
        <section className="docs-prose-section" id="source">
          <h2>Source</h2>
          <CodeBlock code={component.source} label={component.fileName} />
        </section>
      </DocsShell>
    </main>
  );
}
