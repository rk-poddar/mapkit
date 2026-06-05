"use client";

import { usePathname } from "next/navigation";
import { headerNavItems } from "@/app/docs-nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainNav({ className, ...props }: React.ComponentProps<"nav">) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className={cn("flex items-center gap-1", className)} {...props}>
      {headerNavItems.map((item) => {
        const isActive = item.label === "Blocks" ? pathname === item.href : pathname.startsWith(item.match);

        return (
          <Button
            asChild
            className={cn(
              "h-8 px-2.5 text-[15px] font-medium text-muted-foreground hover:bg-transparent hover:text-foreground",
              isActive && "text-foreground",
            )}
            key={item.href}
            size="sm"
            variant="ghost"
          >
            <a aria-current={isActive ? "page" : undefined} href={item.href}>
              {item.label}
            </a>
          </Button>
        );
      })}
    </nav>
  );
}
