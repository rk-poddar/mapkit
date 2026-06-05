"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { docsSidebarGroups } from "@/app/docs-nav";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/docs/getting-started", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/docs/registry", label: "Blocks" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button aria-label="Open docs menu" className="shrink-0 lg:hidden" size="icon-sm" type="button" variant="ghost">
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <Logo isLink={false} />
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-3 pb-8">
          <nav aria-label="Mobile documentation navigation" className="space-y-6">
            <div>
              <h3 className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">Pages</h3>
              <ul className="space-y-0.5">
                {pageLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      className="flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {docsSidebarGroups.map((group) => (
              <div key={group.label}>
                <h3 className="text-muted-foreground mb-2 px-2 text-xs font-medium tracking-wide uppercase">{group.label}</h3>
                <ul className="space-y-0.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <a
                        className="flex items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent"
                        href={link.href}
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
