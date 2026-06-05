import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  isLink?: boolean;
  onClick?: () => void;
};

export function Logo({ className, isLink = true, onClick }: LogoProps) {
  const logoClasses = "inline-flex items-center gap-1.5 text-[17px] leading-none font-bold";

  if (isLink) {
    return (
      <a className={cn(logoClasses, "h-8", className)} href="/" onClick={onClick} aria-label="Map Kit home">
        <MapPin aria-hidden="true" className="size-4" />
        mapkit
      </a>
    );
  }

  return (
    <div className={cn(logoClasses, className)}>
      <MapPin aria-hidden="true" className="size-4" />
      mapkit
    </div>
  );
}
