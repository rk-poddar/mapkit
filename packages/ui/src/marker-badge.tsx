import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type MarkerBadgeVariant = "pin" | "dot" | "badge";
export type MarkerBadgeSize = "sm" | "md" | "lg";

export type MarkerBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  color?: string;
  label?: string;
  size?: MarkerBadgeSize;
  variant?: MarkerBadgeVariant;
};

const sizeClass: Record<MarkerBadgeSize, string> = {
  sm: "h-5 w-5 text-[10px]",
  md: "h-6 w-6 text-xs",
  lg: "h-8 w-8 text-sm",
};

export function MarkerBadge({
  className,
  color = "#2563eb",
  label,
  size = "md",
  style,
  variant = "pin",
  ...props
}: MarkerBadgeProps) {
  const isPin = variant === "pin";

  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center border-[3px] border-white font-bold text-white shadow-lg",
        sizeClass[size],
        variant === "badge" ? "rounded-full" : "rounded-full rounded-bl-sm",
        isPin && "-rotate-45",
        className,
      )}
      style={{ backgroundColor: color, ...style }}
      {...props}
    >
      {label ? (
        <span className={cn("leading-none", isPin && "rotate-45")}>{label.slice(0, 3)}</span>
      ) : (
        <span className="h-2 w-2 rounded-full bg-white" />
      )}
    </span>
  );
}
