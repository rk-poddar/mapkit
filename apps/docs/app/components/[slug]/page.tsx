import { notFound } from "next/navigation";
import { CodeBlock } from "../../code-block";
import { ComponentPreview } from "../component-preview";
import { DocsShell } from "../../docs-shell";
import { componentDocs, componentGuides, getComponentDoc, getComponentGuide, type ComponentGuide } from "../../docs-data";
import { SiteHeader } from "../../site-header";

export function generateStaticParams() {
  return [...componentDocs, ...componentGuides].map((component) => ({ slug: component.slug }));
}

export default async function ComponentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const component = getComponentDoc(slug);
  const guide = getComponentGuide(slug);

  if (guide) {
    return <ComponentGuidePage guide={guide} />;
  }

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

function ComponentGuidePage({ guide }: { guide: ComponentGuide }) {
  return (
    <main>
      <SiteHeader />
      <DocsShell toc={guide.sections.map((section) => section.title)}>
        <header className="docs-page-header">
          <h1>{guide.name}</h1>
          <p>{guide.description}</p>
        </header>
        <section className="docs-prose-section">
          <div className={`guide-preview guide-preview-${guide.preview}`} aria-label={`${guide.name} preview`}>
            <div className="guide-map-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="guide-route-line" />
            <div className="guide-route-line secondary" />
            <div className="guide-pin primary">A</div>
            <div className="guide-pin secondary">B</div>
            <div className="guide-floating-card">
              <strong>{guide.name}</strong>
              <span>{guide.intro}</span>
            </div>
            <div className="guide-control-stack">
              <button type="button">+</button>
              <button type="button">-</button>
              <button type="button">⌖</button>
            </div>
          </div>
        </section>
        {guide.sections.map((section) => (
          <section className="docs-prose-section" id={section.id} key={section.id}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.code ? <CodeBlock code={section.code} label={section.title} /> : null}
          </section>
        ))}
      </DocsShell>
    </main>
  );
}
