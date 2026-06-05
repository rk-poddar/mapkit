"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ExampleCardProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
};

export function ExampleCard({ children, className, stagger = 5 }: ExampleCardProps) {
  return (
    <div
      className={cn(
        "animate-scale-in animate-stagger relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm",
        className,
      )}
      style={{ "--stagger": stagger } as CSSProperties}
    >
      {children}
    </div>
  );
}
