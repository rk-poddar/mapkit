import type { ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

export type MapControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function MapControlButton({
  active,
  className,
  type = "button",
  ...props
}: MapControlButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        active && "border-blue-600 bg-blue-600 text-white hover:bg-blue-700",
        className,
      )}
      {...props}
    />
  );
}
