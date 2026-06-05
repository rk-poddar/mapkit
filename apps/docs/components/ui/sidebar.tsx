"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const SidebarContext = React.createContext<{ open: boolean }>({ open: true });

function SidebarProvider({
  children,
  className,
  defaultOpen = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { defaultOpen?: boolean }) {
  const value = React.useMemo(() => ({ open: defaultOpen }), [defaultOpen]);

  return (
    <SidebarContext.Provider value={value}>
      <div className={cn("group/sidebar-wrapper w-full", className)} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  className,
  side = "left",
  ...props
}: React.HTMLAttributes<HTMLElement> & { side?: "left" | "right" }) {
  const { open } = React.useContext(SidebarContext);

  return (
    <aside
      data-side={side}
      data-state={open ? "expanded" : "collapsed"}
      className={cn("hidden shrink-0 lg:block", className)}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0 flex-1", className)} {...props} />;
}

function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex h-full min-h-0 flex-col", className)} {...props} />;
}

function SidebarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1", className)} {...props} />;
}

function SidebarGroupLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-2 py-1 text-xs font-medium tracking-wide text-muted-foreground uppercase", className)} {...props} />;
}

function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-0.5", className)} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0", className)} {...props} />;
}

function SidebarMenuButton({
  asChild = false,
  className,
  isActive = false,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-active={isActive}
      className={cn(
        "flex h-9 w-full items-center rounded-md px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
};
