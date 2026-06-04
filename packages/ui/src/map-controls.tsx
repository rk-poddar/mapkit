import { MapControls as HeadlessMapControls, type MapControlsProps } from "@map-kit/react";
import { cn } from "./utils";

export type StyledMapControlsProps = MapControlsProps & {
  compact?: boolean;
};

export function MapControls({ className, compact, buttonClassName, ...props }: StyledMapControlsProps) {
  return (
    <HeadlessMapControls
      unstyled
      className={cn(
        "rounded-lg border border-slate-200 bg-white/95 p-1.5 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80",
        compact ? "gap-1" : "gap-1.5",
        className,
      )}
      buttonClassName={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent bg-white px-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonClassName,
      )}
      {...props}
    />
  );
}
