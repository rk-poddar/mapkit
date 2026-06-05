"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";

type SheetContextValue = {
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const SheetContext = React.createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = React.useContext(SheetContext);

  if (!context) {
    throw new Error("Sheet components must be used within Sheet");
  }

  return context;
}

function Sheet({
  children,
  onOpenChange,
  open = false,
}: {
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) {
  const value = React.useMemo(
    () => ({
      onOpenChange: onOpenChange ?? (() => undefined),
      open,
    }),
    [onOpenChange, open],
  );

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

function SheetTrigger({
  asChild = false,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: React.MouseEventHandler }>, {
      onClick: (event: React.MouseEvent) => {
        (children as React.ReactElement<{ onClick?: React.MouseEventHandler }>).props.onClick?.(event);
        onOpenChange(true);
      },
    });
  }

  return (
    <button className={className} onClick={() => onOpenChange(true)} type="button" {...props}>
      {children}
    </button>
  );
}

function SheetContent({
  children,
  className,
  side = "left",
  showCloseButton = true,
}: {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  side?: "bottom" | "left" | "right" | "top";
}) {
  const { onOpenChange, open } = useSheetContext();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onOpenChange(false);
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

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999]">
        <button
          aria-label="Close menu"
          className="absolute inset-0 border-0 bg-black/50"
          onClick={() => onOpenChange(false)}
          type="button"
        />
        <div
          aria-modal="true"
          className={cn(
            "absolute flex flex-col bg-background shadow-xl",
            side === "left" && "inset-y-0 left-0 h-full w-[min(20rem,85vw)] border-r",
            side === "right" && "inset-y-0 right-0 h-full w-[min(20rem,85vw)] border-l",
            side === "top" && "inset-x-0 top-0 border-b",
            side === "bottom" && "inset-x-0 bottom-0 border-t",
            className,
          )}
          role="dialog"
        >
        {children}
        {showCloseButton ? (
          <Button
            aria-label="Close menu"
            className="absolute top-3 right-3"
            onClick={() => onOpenChange(false)}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
        </div>
      </div>
    </Portal>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 border-b p-4 pr-12", className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-base font-semibold text-foreground", className)} {...props} />;
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger };
