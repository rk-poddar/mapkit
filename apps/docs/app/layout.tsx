import "leaflet/dist/leaflet.css";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Map Kit",
  description: "React and Next.js map components for Leaflet, MapLibre, Google Maps, and Mapbox.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="dark" lang="en">
      <body>{children}</body>
    </html>
  );
}
