import type { ReactNode } from "react";
import { DocsSidebar } from "./docs-sidebar";
import { toTocHref } from "./docs-nav";

type DocsShellProps = {
  children: ReactNode;
  title?: string;
  toc?: string[];
};

export function DocsShell({ children, title = "On This Page", toc = [] }: DocsShellProps) {
  return (
    <section className="docs-shell">
      <DocsSidebar />
      <div className="docs-content">{children}</div>
      <aside className="docs-toc" aria-label={title}>
        <span>{title}</span>
        {toc.map((item) => (
          <a href={toTocHref(item)} key={item}>
            {item}
          </a>
        ))}
      </aside>
    </section>
  );
}
