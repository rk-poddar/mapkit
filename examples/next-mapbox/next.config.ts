import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@map-kit/mapbox", "@map-kit/react", "@map-kit/core"],
  typedRoutes: false,
};

export default nextConfig;
