import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { tocFromTitles } from "../../docs-nav";
import { engineDocs } from "../../docs-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const engineCommands = [
  ["Leaflet", "pnpm add @map-kit/leaflet leaflet"],
  ["MapLibre", "pnpm add @map-kit/maplibre maplibre-gl"],
  ["Mapbox", "pnpm add @map-kit/mapbox mapbox-gl"],
  ["Google Maps", "pnpm add @map-kit/google-maps"],
] as const;

export default function EnginesPage() {
  return (
    <DocsShell toc={tocFromTitles(["Choosing Engines", "Install Commands"])}>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Engines</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">One React API across the map engines teams already use.</p>
        </header>
        <section className="mt-12 space-y-5 scroll-m-24" id="choosing-engines">
          <h2 className="text-2xl font-semibold tracking-tight">Choosing Engines</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {engineDocs.map(([name, label, description]) => (
              <Card className="p-5" key={name}>
                <strong>{name}</strong>
                <Badge className="mt-3 block w-fit" variant="secondary">{label}</Badge>
                <p className="text-muted-foreground mt-3 text-sm leading-6">{description}</p>
              </Card>
            ))}
          </div>
        </section>
        <section className="mt-12 space-y-5 scroll-m-24" id="install-commands">
          <h2 className="text-2xl font-semibold tracking-tight">Install Commands</h2>
          <div className="grid gap-5">
            {engineCommands.map(([name, command]) => (
              <article className="space-y-3" key={name}>
                <h3 className="font-semibold">{name}</h3>
                <CodeBlock code={command} language="bash" />
              </article>
            ))}
          </div>
        </section>
    </DocsShell>
  );
}
