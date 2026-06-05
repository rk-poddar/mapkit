export type DocsNavLink = {
  description: string;
  href: string;
  label: string;
  type: "Page" | "Guide" | "Component" | "Block";
};

export type TocItem = {
  slug: string;
  title: string;
};

export const docsSidebarGroups: Array<{ label: string; links: DocsNavLink[] }> = [
  {
    label: "Basics",
    links: [
      {
        description: "Map Kit philosophy, engine model, and setup flow.",
        href: "/docs/getting-started",
        label: "Getting Started",
        type: "Guide",
      },
      {
        description: "Install Map Kit and render your first map.",
        href: "/docs/installation",
        label: "Installation",
        type: "Guide",
      },
      {
        description: "Core component contract, props, and hooks.",
        href: "/docs/api-reference",
        label: "API Reference",
        type: "Guide",
      },
    ],
  },
  {
    label: "Components",
    links: [
      {
        description: "The root map primitive for React and Next.js apps.",
        href: "/components/map",
        label: "Map",
        type: "Component",
      },
      {
        description: "Zoom, fullscreen, reset, and map UI controls.",
        href: "/components/controls",
        label: "Controls",
        type: "Component",
      },
      {
        description: "Markers, labels, badges, and interactive pins.",
        href: "/components/markers",
        label: "Markers",
        type: "Component",
      },
      {
        description: "Popup and tooltip surfaces for map context.",
        href: "/components/popups",
        label: "Popups",
        type: "Component",
      },
      {
        description: "Routes, polylines, progress paths, and geofences.",
        href: "/components/routes",
        label: "Routes",
        type: "Component",
      },
      {
        description: "Engine switching, adapter access, and custom layers.",
        href: "/components/advanced",
        label: "Advanced",
        type: "Component",
      },
    ],
  },
  {
    label: "Blocks",
    links: [
      {
        description: "Browse copy-paste UI blocks built for Map Kit.",
        href: "/components",
        label: "All Blocks",
        type: "Block",
      },
      {
        description: "Registry metadata for CLI and remote installs.",
        href: "/docs/registry",
        label: "Registry",
        type: "Block",
      },
    ],
  },
];

export const headerNavItems = [
  { href: "/docs/getting-started", label: "Docs", match: "/docs" },
  { href: "/components", label: "Components", match: "/components" },
  { href: "/docs/registry", label: "Blocks", match: "/docs/registry" },
] as const;

export const docsSearchLinks = docsSidebarGroups.flatMap((group) => group.links);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function tocFromTitles(titles: string[]): TocItem[] {
  return titles.map((title) => ({
    title,
    slug: slugify(title),
  }));
}
