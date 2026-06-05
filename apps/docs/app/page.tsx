import type { CSSProperties } from "react";
import { componentDocs, engineDocs, installSteps } from "./docs-data";
import { HomeMapShowcase } from "./home-map-showcase";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <>
      <PageHeader>
        <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
        <PageHeaderDescription>
          Ready-to-use, customizable map components for React and Next.js.
          <br className="hidden sm:block" />
          Built on MapLibre. Styled with Tailwind.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="default">
            <a href="/docs/getting-started">Get Started</a>
          </Button>
          <Button asChild size="default" variant="outline">
            <a href="/components">View Components</a>
          </Button>
        </PageActions>
      </PageHeader>

      <section
        className="animate-fade-in animate-stagger container-wide pt-4"
        style={{ "--stagger": 4 } as CSSProperties}
      >
        <HomeMapShowcase />
      </section>

      <section className="container space-y-6 py-20" id="docs">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Quick start</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">From install to rendered map in minutes.</h2>
        </div>
        <div className="grid gap-3">
          {installSteps.map((step, index) => (
            <Card className="flex items-center gap-3 p-4" key={step}>
              <span className="bg-muted grid size-8 shrink-0 place-items-center rounded-md text-sm font-medium">{index + 1}</span>
              <code className="text-muted-foreground overflow-auto text-sm">{step}</code>
            </Card>
          ))}
        </div>
      </section>

      <section className="container space-y-6 py-20" id="components">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Components</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">Import from the package or copy the block into your app.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {componentDocs.map((component) => (
            <Card asChild className="p-5 transition-colors hover:bg-accent/50" key={component.name}>
              <a href={`/components/${component.slug}`}>
                <Badge variant="secondary">{component.category}</Badge>
                <h3 className="mt-4 text-xl font-semibold">{component.name}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-6">{component.description}</p>
                <code className="text-muted-foreground mt-4 block overflow-auto rounded-md bg-muted p-3 text-xs">{component.command}</code>
              </a>
            </Card>
          ))}
        </div>
      </section>

      <section className="container space-y-6 py-20" id="engines">
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wide">Engines</p>
          <h2 className="max-w-2xl text-4xl font-semibold tracking-tight">Pick the map engine that matches the product decision.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {engineDocs.map(([name, label, description]) => (
            <Card className="p-5" key={name}>
              <strong>{name}</strong>
              <Badge className="mt-3 block w-fit" variant="secondary">{label}</Badge>
              <p className="text-muted-foreground mt-3 text-sm leading-6">{description}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
