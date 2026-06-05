"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const handleToggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="size-8 rounded-md" />;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-keyshortcuts="T"
          aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
          onClick={handleToggleTheme}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          {resolvedTheme === "dark" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="flex items-center gap-2 pr-1">
        Toggle Theme <Kbd>T</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
