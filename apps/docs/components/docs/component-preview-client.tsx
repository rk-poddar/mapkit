"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

type ComponentPreviewClientProps = {
  children: React.ReactNode;
  className?: string;
  code: string;
  highlightedCode: string;
};

export function ComponentPreviewClient({
  children,
  className,
  code,
  highlightedCode,
}: ComponentPreviewClientProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className={cn("h-[420px] w-full overflow-hidden rounded-lg border", className)}>{children}</div>

      <div className="relative w-full overflow-hidden rounded-lg border">
        <div className="absolute top-2 right-2 z-10">
          <CopyButton text={code} />
        </div>
        <div
          className={cn(
            "bg-muted/40 overflow-hidden p-4 text-sm transition-[max-height] [&_code]:bg-transparent! [&_pre]:bg-transparent!",
            expanded ? "max-h-[420px] overflow-auto" : "max-h-44",
          )}
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex w-full items-center justify-center",
            !expanded && "from-background to-background/0 bg-linear-to-t pt-12 pb-6",
          )}
        >
          {!expanded ? (
            <Button
              className="bg-background hover:bg-muted dark:bg-background dark:hover:bg-muted"
              onClick={() => setExpanded(true)}
              size="sm"
              type="button"
              variant="outline"
            >
              View Code
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
