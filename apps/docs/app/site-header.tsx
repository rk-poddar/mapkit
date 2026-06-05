"use client";

import { DocsSearch } from "./docs-search";
import { GitHubButton } from "@/components/github-button";
import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "border-b bg-background/85 supports-backdrop-filter:bg-background/70 sticky top-0 z-[100] h-14 w-full backdrop-blur",
        className,
      )}
    >
      <nav className="container flex h-14 items-center gap-2">
        <MobileNav />
        <Logo className="shrink-0" />
        <Separator className="ml-1 hidden h-4 lg:block" orientation="vertical" />
        <MainNav className="ml-1 hidden lg:flex" />
        <div className="ml-auto flex items-center gap-1">
          <DocsSearch />
          <GitHubButton />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
