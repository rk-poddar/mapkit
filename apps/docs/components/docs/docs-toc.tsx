"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
  slug: string;
  title: string;
};

type DocsTocProps = {
  className?: string;
  items: TocItem[];
};

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%" },
    );

    for (const id of itemIds) {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    }

    return () => observer.disconnect();
  }, [itemIds]);

  return activeId;
}

export function DocsToc({ className, items }: DocsTocProps) {
  const itemIds = useMemo(() => items.map((item) => item.slug), [items]);
  const activeHeading = useActiveItem(itemIds);

  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="On this page" className={cn("flex flex-col", className)}>
      <p className="text-muted-foreground mb-3 text-xs font-medium">On This Page</p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => {
          const isActive = item.slug === activeHeading;

          return (
            <a
              className={cn(
                "py-1 text-sm no-underline transition-colors",
                isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              )}
              href={`#${item.slug}`}
              key={item.slug}
            >
              {item.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
