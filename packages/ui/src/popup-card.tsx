import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./utils";

export type PopupCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
};

export function PopupCard({ children, className, description, footer, title, ...props }: PopupCardProps) {
  return (
    <div
      className={cn(
        "min-w-56 rounded-lg border border-slate-200 bg-white p-3 text-slate-900 shadow-xl",
        className,
      )}
      {...props}
    >
      {title ? <div className="text-sm font-semibold leading-5 text-slate-950">{title}</div> : null}
      {description ? <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div> : null}
      {children ? <div className="mt-3 text-sm leading-5 text-slate-700">{children}</div> : null}
      {footer ? <div className="mt-3 border-t border-slate-100 pt-3">{footer}</div> : null}
    </div>
  );
}
