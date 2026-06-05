"use client";

import { ArrowDown, ArrowUp, CornerDownLeft, FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { siteNavigation } from "@/lib/site-navigation";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export function DocsSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <Button
        aria-label="Jump to pages, components, and docs"
        className={cn(
          "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground hidden h-9 w-48 justify-start md:inline-flex",
          className,
        )}
        onClick={() => setOpen(true)}
        size="sm"
        type="button"
        variant="ghost"
      >
        <Search aria-hidden="true" className="size-3.5" />
        <span>Search...</span>
        <Kbd className="ml-auto bg-transparent">⌘K</Kbd>
      </Button>
      <Button
        aria-label="Open search"
        className="md:hidden"
        onClick={() => setOpen(true)}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <Search aria-hidden="true" className="size-4" />
      </Button>
      <CommandDialog
        description="Jump to pages, components, and docs"
        onOpenChange={setOpen}
        open={open}
        showCloseButton={false}
        title="Search..."
      >
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty className="text-muted-foreground py-8 text-sm">
            <div className="flex flex-col items-center gap-1.5">
              <FileText className="size-5 opacity-40" />
              <span>No results found</span>
            </div>
          </CommandEmpty>
          {siteNavigation.map((group) => (
            <CommandGroup heading={group.title} key={group.title}>
              {group.items.map((item) => (
                <CommandItem key={item.href} onSelect={() => handleSelect(item.href)} value={item.title}>
                  <item.icon aria-hidden="true" />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="text-muted-foreground/80 flex items-center justify-between border-t p-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5">
              <Kbd>
                <ArrowUp className="size-3" />
              </Kbd>
              <Kbd>
                <ArrowDown className="size-3" />
              </Kbd>
              <span>navigate</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>
                <CornerDownLeft className="size-3" />
              </Kbd>
              <span>select</span>
            </span>
          </div>
          <span className="flex items-baseline gap-1.5">
            <Kbd>esc</Kbd>
            <span>close</span>
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
