import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DocsCode({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code className={cn("bg-muted relative rounded-md px-1.5 py-0.5 font-mono text-sm", className)}>
      {children}
    </code>
  );
}
