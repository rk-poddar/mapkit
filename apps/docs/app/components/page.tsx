import { ComponentPreview } from "./component-preview";
import { DocsShell } from "../docs-shell";
import { tocFromTitles } from "../docs-nav";
import { componentDocs, componentGuides } from "../docs-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function ComponentsPage() {
  return (
    <DocsShell toc={tocFromTitles(["Primitives", "Blocks"])}>
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
          <p className="text-muted-foreground text-base leading-relaxed">Map primitives and copy-paste UI blocks for real product surfaces.</p>
        </header>
        <section className="mt-12 space-y-5 scroll-m-24" id="primitives">
          <h2 className="text-xl font-semibold tracking-tight">Primitives</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {componentGuides.map((component) => (
              <Card asChild className="p-5 transition-colors hover:bg-accent/50" key={component.slug}>
                <a href={`/components/${component.slug}`}>
                  <span className="text-lg font-semibold">{component.name}</span>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">{component.description}</p>
                </a>
              </Card>
            ))}
          </div>
        </section>
        <section className="mt-12 space-y-5 scroll-m-24" id="blocks">
          <h2 className="text-xl font-semibold tracking-tight">Blocks</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {componentDocs.map((component) => (
              <Card asChild className="p-4 transition-colors hover:bg-accent/50" key={component.slug}>
                <a href={`/components/${component.slug}`}>
                  <ComponentPreview component={component} />
                  <Badge className="mt-4" variant="secondary">{component.category}</Badge>
                  <h2 className="mt-3 text-lg font-semibold">{component.name}</h2>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">{component.description}</p>
                  <code className="text-muted-foreground mt-4 block overflow-auto rounded-md bg-muted p-3 text-xs">{component.command}</code>
                </a>
              </Card>
            ))}
          </div>
        </section>
    </DocsShell>
  );
}
