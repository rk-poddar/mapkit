import { CodeBlock } from "../../code-block";
import { DocsShell } from "../../docs-shell";
import { tocFromTitles } from "../../docs-nav";
import { installSteps } from "../../docs-data";
import { Card } from "@/components/ui/card";

const snippets = [
  {
    title: "Leaflet provider",
    code: `import { leafletAdapter } from "@map-kit/leaflet";
import { Map, Marker } from "@map-kit/react";

<Map adapter={leafletAdapter} engine="leaflet" provider="osm" center={[28.6139, 77.209]} zoom={10}>
  <Marker id="delhi" position={[28.6139, 77.209]} title="Delhi hub" />
</Map>`,
  },
  {
    title: "Copy UI blocks",
    code: `pnpm dlx @map-kit/cli add map-controls popup-card marker-badge map-legend --out src/components/map-kit`,
  },
];

export default function InstallationPage() {
  return (
    <DocsShell toc={tocFromTitles(["Prerequisites", "Installation", "Usage"])}>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Installation</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">How to install and set up Map Kit in your project.</p>
        </header>

        <section className="mt-12 space-y-5 scroll-m-24" id="prerequisites">
          <h2 className="text-2xl font-semibold tracking-tight">Prerequisites</h2>
          <p className="docs-prose">A React or Next.js project. Tailwind and shadcn/ui patterns are recommended for copied UI blocks.</p>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="installation">
          <h2 className="text-2xl font-semibold tracking-tight">Installation</h2>
          <p className="docs-prose">Start with the React primitives and one map engine adapter:</p>
          <div className="grid gap-3">
            {installSteps.map((step, index) => (
              <Card className="flex items-center gap-3 p-4" key={step}>
                <span className="bg-muted grid size-8 shrink-0 place-items-center rounded-md text-sm font-medium">{index + 1}</span>
                <code className="text-muted-foreground overflow-auto text-sm">{step}</code>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="usage">
          <h2 className="text-2xl font-semibold tracking-tight">Usage</h2>
          <div className="grid gap-5">
            {snippets.map((snippet) => (
              <article className="space-y-3" key={snippet.title}>
                <h3 className="font-semibold">{snippet.title}</h3>
                <CodeBlock code={snippet.code} />
              </article>
            ))}
          </div>
        </section>
    </DocsShell>
  );
}
