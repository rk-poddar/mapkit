import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { tocFromTitles } from "../../docs-nav";
import { componentDocs } from "../../docs-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    <DocsShell toc={tocFromTitles(["Commands", "Index Payload", "Registry Items"])}>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Blocks Registry</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Component metadata that powers install, preview, and future remote registry flows.</p>
        </header>
        <section className="mt-12 space-y-5 scroll-m-24" id="commands">
          <h2 className="text-2xl font-semibold tracking-tight">Commands</h2>
          <div className="grid gap-3">
            {["map-kit registry", "map-kit registry map-controls", "map-kit add map-controls"].map((command) => (
              <code className="text-muted-foreground block overflow-auto rounded-md border bg-muted p-3 text-sm" key={command}>{command}</code>
            ))}
          </div>
        </section>
        <section className="mt-12 space-y-5 scroll-m-24" id="index-payload">
          <h2 className="text-2xl font-semibold tracking-tight">Index Payload</h2>
          <CodeBlock code={registryPayload} language="json" />
        </section>
        <section className="mt-12 space-y-5 scroll-m-24" id="registry-items">
          <h2 className="text-2xl font-semibold tracking-tight">Registry Items</h2>
          <div className="grid gap-3">
            {componentDocs.map((component) => (
              <Card asChild className="p-4 transition-colors hover:bg-accent/50" key={component.slug}>
                <a href={`/components/${component.slug}`}>
                  <div className="flex items-start justify-between gap-3">
                    <strong>{component.name}</strong>
                    <Badge variant="secondary">{component.category}</Badge>
                  </div>
                  <code className="text-muted-foreground mt-3 block text-sm">{component.fileName}</code>
                </a>
              </Card>
            ))}
          </div>
        </section>
    </DocsShell>
  );
}
