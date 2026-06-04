"use client";

import { useMemo, useState } from "react";
import { docsSearchLinks } from "./docs-nav";
import { componentDocs } from "./docs-data";

const docsLinks = [
  ...docsSearchLinks,
  ...componentDocs.map((component) => ({
    description: component.description,
    href: `/components/${component.slug}`,
    label: component.name,
    type: "Block" as const,
  })),
];

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return docsLinks;
    }

    return docsLinks
      .filter((item) =>
        [item.label, item.description, item.type].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
      .slice(0, 6);
  }, [query]);

  return (
    <>
      <button className="docs-search-trigger" onClick={() => setOpen(true)} type="button">
        <span>Search...</span>
        <kbd>⌘K</kbd>
      </button>
      {open ? (
        <div className="command-overlay" role="presentation">
          <button aria-label="Close search" className="command-scrim" onClick={() => setOpen(false)} type="button" />
          <div aria-label="Docs command menu" className="command-dialog" role="dialog">
            <div className="command-input-row">
              <span>⌕</span>
              <label className="sr-only" htmlFor="docs-search">
                Search docs
              </label>
              <input
                autoComplete="off"
                autoFocus
                id="docs-search"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                type="search"
                value={query}
              />
            </div>
            <div className="command-list">
              <span className="command-section-label">Pages</span>
              {results.length ? (
                results.map((item) => (
                  <a aria-label={`Search result: ${item.label}`} href={item.href} key={item.href}>
                    <span>↳</span>
                    <strong>{item.label}</strong>
                    <small>{item.type}</small>
                  </a>
                ))
              ) : (
                <p>No docs found.</p>
              )}
            </div>
            <div className="command-footer">
              <span>↑ ↓ navigate</span>
              <span>↵ select</span>
              <button onClick={() => setOpen(false)} type="button">
                esc close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
