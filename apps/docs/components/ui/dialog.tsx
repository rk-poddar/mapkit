"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";

type DialogProps = {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
};

function Dialog({ children, onOpenChange, open = false }: DialogProps) {
  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onOpenChange, open]);

  if (!open) {
    return null;
  }

  return <Portal><div className="fixed inset-0 z-[9999]">{children}</div></Portal>;
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DialogOverlay({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      aria-label="Close dialog"
      className={cn("absolute inset-0 border-0 bg-black/70", className)}
      onClick={onClick}
      type="button"
      {...props}
    />
  );
}

function DialogContent({
  className,
  showCloseButton = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { showCloseButton?: boolean }) {
  return (
    <div
      className={cn(
        "absolute top-[min(22vh,7.5rem)] left-1/2 w-[min(690px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-2xl",
        className,
      )}
      role="dialog"
      {...props}
    />
  );
}

export { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle };
