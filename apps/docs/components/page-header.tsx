import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  align?: "center" | "left";
  children: ReactNode;
  className?: string;
  showBackground?: boolean;
};

export function PageHeader({ align = "center", children, className, showBackground = true }: PageHeaderProps) {
  return (
    <div className="relative">
      {showBackground ? (
        <div className="pointer-events-none absolute inset-x-0 -inset-y-10 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        </div>
      ) : null}
      <section
        className={cn(
          "container relative flex w-full max-w-5xl flex-col gap-5 py-14 md:py-20 lg:py-24",
          align === "center" ? "items-center text-center" : "items-start text-left",
          className,
        )}
      >
        {children}
      </section>
    </div>
  );
}

export function PageHeaderHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn("max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl", className)}
    >
      {children}
    </h1>
  );
}

export function PageHeaderDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn("max-w-2xl text-lg leading-relaxed text-foreground/80 sm:text-lg md:text-xl", className)}
    >
      {children}
    </p>
  );
}

export function PageActions({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mt-2 flex flex-wrap items-center justify-center gap-3", className)}>
      {children}
    </div>
  );
}
