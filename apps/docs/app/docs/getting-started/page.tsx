import { DocsShell } from "../../docs-shell";
import { tocFromTitles } from "../../docs-nav";
import { Card } from "@/components/ui/card";

export default function GettingStartedPage() {
  return (
    <DocsShell toc={tocFromTitles(["Philosophy", "Why Map Kit", "Any Map Engine", "Features"])}>
        <header className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">Introduction</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">Copy-paste map components for React and Next.js, backed by adapter packages for real map engines.</p>
        </header>

        <section className="mt-12 space-y-5 scroll-m-24" id="philosophy">
          <h2 className="text-2xl font-semibold tracking-tight">Philosophy</h2>
          <div className="docs-prose space-y-4">
            <p>
              Map Kit follows the shadcn model for maps: own the UI code you ship, keep the core primitives small, and
              choose the map engine that fits your product instead of locking the app to one provider.
            </p>
            <p>
              The goal is simple: maps should feel like the rest of your React system. Controls, markers, popups, routes,
              and legends should be composable, themeable, and easy to copy into an app.
            </p>
          </div>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="why-map-kit">
          <h2 className="text-2xl font-semibold tracking-tight">Why Map Kit</h2>
          <ul className="docs-prose list-disc space-y-2 pl-5">
            <li><strong className="text-foreground font-medium">Own your code:</strong> copy polished UI blocks into your project and customize them without waiting on package releases.</li>
            <li><strong className="text-foreground font-medium">Start fast:</strong> render a production-friendly map with one React API and a provider adapter.</li>
            <li><strong className="text-foreground font-medium">Scale safely:</strong> use shared primitives first, then access raw engine APIs when advanced map behavior needs them.</li>
          </ul>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="any-map-engine">
          <h2 className="text-2xl font-semibold tracking-tight">Any Map Engine</h2>
          <p className="docs-prose">
            The public API is designed around shared map concepts: center, zoom, markers, popups, routes, circles, and
            controls. Leaflet, MapLibre, Mapbox, and Google Maps adapters translate those concepts into native engine
            behavior.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Leaflet", "MapLibre", "Mapbox", "Google Maps"].map((engine) => (
              <Card className="p-4 text-center font-medium" key={engine}>{engine}</Card>
            ))}
          </div>
        </section>

        <section className="mt-12 space-y-5 scroll-m-24" id="features">
          <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["React primitives", "Map, Marker, Popup, Tooltip, Route, Circle, FitBounds, and map controller hooks."],
              ["Copy-paste blocks", "Controls, marker badges, popup cards, and legends that match app UI instead of engine chrome."],
              ["Registry ready", "CLI metadata and source files are structured so docs previews and install commands stay connected."],
            ].map(([title, body]) => (
              <Card className="p-4" key={title}>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{body}</p>
              </Card>
            ))}
          </div>
        </section>
    </DocsShell>
  );
}
