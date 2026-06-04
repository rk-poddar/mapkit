"use client";

import { usePathname } from "next/navigation";
import { DocsSearch } from "./docs-search";
import { headerNavItems } from "./docs-nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header-left">
        <a className="brand" href="/" aria-label="Map Kit home">
          <span className="brand-mark">⌖</span>
          mapkit
        </a>
        <nav aria-label="Primary navigation">
          {headerNavItems.map((item) => {
            const isActive = item.label === "Blocks" ? pathname === item.href : pathname.startsWith(item.match);

            return (
              <a aria-current={isActive ? "page" : undefined} href={item.href} key={item.href}>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
      <div className="site-header-right">
        <DocsSearch />
        <a className="github-link" href="https://github.com/rk-poddar/mapkit">
          GitHub
        </a>
        <button aria-label="Toggle theme preview" className="theme-toggle" type="button">
          ◐
        </button>
      </div>
    </header>
  );
}
