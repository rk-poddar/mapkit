import type { ReactNode } from "react";

const sidebarGroups = [
  {
    label: "Basics",
    links: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/engines", label: "Engines" },
      { href: "/docs/registry", label: "Registry" },
    ],
  },
  {
    label: "Components",
    links: [
      { href: "/components", label: "All components" },
      { href: "/components/map-controls", label: "Map Controls" },
      { href: "/components/marker-badge", label: "Marker Badge" },
      { href: "/components/popup-card", label: "Popup Card" },
      { href: "/components/map-legend", label: "Map Legend" },
    ],
  },
];

type DocsShellProps = {
  children: ReactNode;
  title?: string;
  toc?: string[];
};

export function DocsShell({ children, title = "On This Page", toc = [] }: DocsShellProps) {
  return (
    <section className="docs-shell">
      <aside className="docs-sidebar" aria-label="Documentation navigation">
        {sidebarGroups.map((group) => (
          <div className="docs-sidebar-group" key={group.label}>
            <span>{group.label}</span>
            {group.links.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </aside>
      <div className="docs-content">{children}</div>
      <aside className="docs-toc" aria-label={title}>
        <span>{title}</span>
        {toc.map((item) => (
          <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
            {item}
          </a>
        ))}
      </aside>
    </section>
  );
}
