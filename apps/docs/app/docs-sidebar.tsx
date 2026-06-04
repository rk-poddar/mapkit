"use client";

import { usePathname } from "next/navigation";
import { docsSidebarGroups } from "./docs-nav";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="docs-sidebar" aria-label="Documentation navigation">
      {docsSidebarGroups.map((group) => (
        <div className="docs-sidebar-group" key={group.label}>
          <span>{group.label}</span>
          {group.links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <a aria-current={isActive ? "page" : undefined} href={link.href} key={link.href}>
                {link.label}
              </a>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
