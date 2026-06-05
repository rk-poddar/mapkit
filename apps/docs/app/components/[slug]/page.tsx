import { notFound } from "next/navigation";
import { CodeBlock } from "../../code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsCode } from "@/components/docs/docs-code";
import { DocsSection } from "@/components/docs/docs-section";
import { GuideExample } from "@/components/docs/guide-example";
import { ComponentPreview as BlockPreview } from "../component-preview";
import { DocsShell } from "../../docs-shell";
import { componentDocs, componentGuides, getComponentDoc, getComponentGuide, type ComponentGuide } from "../../docs-data";
import type { TocItem } from "../../docs-nav";
import { Badge } from "@/components/ui/badge";

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

  const toc: TocItem[] = [
    { title: "Preview", slug: "preview" },
    { title: "Installation", slug: "installation" },
    { title: "Usage", slug: "usage" },
    { title: "Source", slug: "source" },
  ];

  return (
    <DocsShell toc={toc}>
      <header className="space-y-3">
        <Badge variant="secondary">{component.category}</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">{component.name}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">{component.description}</p>
      </header>

      <div className="mt-12 space-y-12">
        <DocsSection id="preview" title="Preview">
          <div className="h-[420px] overflow-hidden rounded-lg border">
            <BlockPreview component={component} />
          </div>
        </DocsSection>

        <DocsSection id="installation" title="Installation">
          <CodeBlock code={component.command} language="bash" />
          <div className="flex flex-wrap gap-2">
            <code className="text-muted-foreground rounded-md bg-muted px-2 py-1 text-sm">{component.fileName}</code>
            {component.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </DocsSection>

        <DocsSection id="usage" title="Usage">
          <ComponentPreview code={component.usage}>
            <BlockPreview component={component} />
          </ComponentPreview>
        </DocsSection>

        <DocsSection id="source" title="Source">
          <CodeBlock code={component.source} />
        </DocsSection>
      </div>
    </DocsShell>
  );
}

function GuideSectionBody({
  guide,
  sectionId,
  text,
}: {
  guide: ComponentGuide;
  sectionId: string;
  text: string;
}) {
  if (guide.slug === "map" && sectionId === "basic-usage") {
    return (
      <p>
        The <DocsCode>Map</DocsCode> component connects your React tree to a map engine adapter, handles provider
        setup, and gives child components a stable map context.
      </p>
    );
  }

  if (guide.slug === "map" && sectionId === "controlled-mode") {
    return (
      <p>
        Keep <DocsCode>center</DocsCode> and <DocsCode>zoom</DocsCode> in your app state when dashboards or tracking
        pages need controlled viewport behavior.
      </p>
    );
  }

  if (guide.slug === "controls" && sectionId === "basic-usage") {
    return (
      <p>
        Use <DocsCode>MapControls</DocsCode> for zoom, fullscreen, and reset actions without relying on engine-default
        chrome.
      </p>
    );
  }

  return <p>{text}</p>;
}

function ComponentGuidePage({ guide }: { guide: ComponentGuide }) {
  const toc: TocItem[] = guide.sections.map((section) => ({
    title: section.title,
    slug: section.id,
  }));

  return (
    <DocsShell toc={toc}>
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">{guide.name}</h1>
        <p className="text-muted-foreground text-base leading-relaxed">{guide.description}</p>
      </header>

      <div className="mt-12 space-y-12">
        {guide.sections.map((section) => (
          <DocsSection id={section.id} key={section.id} title={section.title}>
            <GuideSectionBody guide={guide} sectionId={section.id} text={section.body} />
            {section.code ? (
              <ComponentPreview code={section.code}>
                <GuideExample preview={guide.preview} sectionId={section.id} />
              </ComponentPreview>
            ) : null}
          </DocsSection>
        ))}
      </div>
    </DocsShell>
  );
}
