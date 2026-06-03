import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Map Kit Next Mapbox",
  description: "Basic Mapbox map rendered through Map Kit.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
