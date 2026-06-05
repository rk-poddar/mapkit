import { BookOpen, CornerDownRight, Layers2, type LucideIcon } from "lucide-react";
import { docsSidebarGroups, headerNavItems } from "@/app/docs-nav";

export type SiteNavigationItem = {
  href: string;
  icon: LucideIcon;
  title: string;
};

export type SiteNavigationGroup = {
  items: SiteNavigationItem[];
  title: string;
};

const pageNavItems: SiteNavigationItem[] = [
  { href: "/", icon: CornerDownRight, title: "Home" },
  ...headerNavItems.map((item) => ({
    href: item.href,
    icon: CornerDownRight,
    title: item.label,
  })),
];

export const siteNavigation: SiteNavigationGroup[] = [
  {
    title: "Pages",
    items: pageNavItems,
  },
  ...docsSidebarGroups.map((group) => ({
    title: group.label,
    items: group.links.map((link) => ({
      href: link.href,
      icon: group.label === "Basics" ? BookOpen : Layers2,
      title: link.label,
    })),
  })),
];
