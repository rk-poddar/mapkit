"use client";

import { usePathname } from "next/navigation";
import { DocsSearch } from "./docs-search";

const navItems = [
  { href: "/docs/installation", label: "Docs", match: "/docs" },
  { href: "/components", label: "Components", match: "/components" },
  { href: "/docs/engines", label: "Engines", match: "/docs/engines" },
  { href: "/docs/registry", label: "Registry", match: "/docs/registry" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Map Kit home">
        <span className="brand-mark">M</span>
        Map Kit
      </a>
      <DocsSearch />
      <nav aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/docs/installation"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.match);

          return (
            <a aria-current={isActive ? "page" : undefined} href={item.href} key={item.href}>
              {item.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
