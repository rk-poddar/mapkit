# Registry

Map Kit exposes a shadcn-style registry contract through `@map-kit/cli`.

The registry is intentionally split into two shapes:

- index payload: lightweight metadata for listings, docs, and search
- item payload: full component metadata plus source files for installation

This keeps docs pages fast while still giving the CLI enough information to copy component files into
an application.

## Index Payload

```bash
pnpm --filter @map-kit/cli build
node packages/cli/dist/index.js registry
```

Shape:

```ts
type RegistryIndex = {
  name: "@map-kit/registry";
  schemaVersion: string;
  items: Array<{
    name: string;
    title: string;
    description: string;
    version: string;
    category: "control" | "marker" | "overlay" | "utility";
    dependencies?: string[];
    registryDependencies?: string[];
    preview?: {
      component: string;
      tags: string[];
    };
    files: Array<{
      path: string;
      type: "registry:component" | "registry:lib";
    }>;
  }>;
};
```

The index intentionally does not include file contents.

## Item Payload

```bash
node packages/cli/dist/index.js registry map-controls
```

Shape:

```ts
type RegistryItem = RegistryIndex["items"][number] & {
  files: Array<{
    path: string;
    type: "registry:component" | "registry:lib";
    content: string;
  }>;
};
```

This payload is the future remote endpoint shape:

```txt
/registry/index.json
/registry/map-controls.json
/registry/popup-card.json
```

## Install Flow

Local install still works through the same registry data:

```bash
pnpm dlx @map-kit/cli add map-controls popup-card --out src/components/map-kit
```

Future remote install can keep the same resolver:

```bash
map-kit add map-controls --registry https://map-kit.dev/registry
```

## Preview Flow

Docs preview pages can read the index payload and use:

- `title` for page/card heading
- `description` for summary text
- `category` for grouping
- `preview.component` for the rendered demo component
- `preview.tags` for filtering
- `registryDependencies` for dependency callouts

The full item payload should only be fetched when the user opens source code or installs a component.
