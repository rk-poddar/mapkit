import type { ReactNode } from "react";
import { DocsToc } from "@/components/docs/docs-toc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DocsSidebar } from "./docs-sidebar";
import type { TocItem } from "./docs-nav";

type DocsShellProps = {
  children: ReactNode;
  toc?: TocItem[];
};

export function DocsShell({ children, toc = [] }: DocsShellProps) {
  return (
    <SidebarProvider className="mx-auto grid min-h-[calc(100svh-3.5rem)] w-full max-w-[1880px] grid-cols-1 px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-x-16 xl:grid-cols-[240px_minmax(0,1fr)_176px] xl:gap-x-20">
      <DocsSidebar />
      <SidebarInset className="flex min-w-0 flex-col py-10 lg:py-12">
        <div className="mx-auto w-full min-w-0 max-w-[50rem] flex-1 lg:px-4">{children}</div>
      </SidebarInset>
      {toc.length > 0 ? (
        <aside className="hidden w-44 shrink-0 xl:block">
          <ScrollArea className="sticky top-14 max-h-[calc(100svh-3.5rem)] py-10">
            <DocsToc items={toc} />
          </ScrollArea>
        </aside>
      ) : null}
    </SidebarProvider>
  );
}
