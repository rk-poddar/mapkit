"use client";

import { usePathname } from "next/navigation";
import { docsSidebarGroups } from "./docs-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      aria-label="Documentation navigation"
      className="sticky top-14 z-30 h-[calc(100svh-3.5rem)] w-full overscroll-none lg:w-[240px]"
    >
      <ScrollArea className="h-full py-8 pr-4">
        <SidebarContent className="gap-6">
          {docsSidebarGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarMenu>
                {group.links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <SidebarMenuItem key={link.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a aria-current={isActive ? "page" : undefined} href={link.href}>
                          {link.label}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </ScrollArea>
    </Sidebar>
  );
}
