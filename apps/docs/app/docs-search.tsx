"use client";

import { useMemo, useState } from "react";
import { componentDocs } from "./docs-data";

const docsLinks = [
  {
    description: "Install packages and render your first map.",
    href: "/docs/installation",
    label: "Installation",
    type: "Guide",
  },
  {
    description: "Compare Leaflet, MapLibre, Mapbox, and Google Maps.",
    href: "/docs/engines",
    label: "Engines",
    type: "Guide",
  },
  {
    description: "Registry metadata, CLI commands, and copy-paste blocks.",
    href: "/docs/registry",
    label: "Registry",
    type: "Guide",
  },
  ...componentDocs.map((component) => ({
    description: component.description,
    href: `/components/${component.slug}`,
    label: component.name,
    type: "Component",
  })),
];

export function DocsSearch() {
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
    <div className="docs-search">
      <label className="sr-only" htmlFor="docs-search">
        Search docs
      </label>
      <input
        autoComplete="off"
        id="docs-search"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search docs..."
        type="search"
        value={query}
      />
      <div className="docs-search-panel">
        {results.length ? (
          results.map((item) => (
            <a aria-label={`Search result: ${item.label}`} href={item.href} key={item.href}>
              <span>{item.type}</span>
              <strong>{item.label}</strong>
              <small>{item.description}</small>
            </a>
          ))
        ) : (
          <p>No docs found.</p>
        )}
      </div>
    </div>
  );
}
