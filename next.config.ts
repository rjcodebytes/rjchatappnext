import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ignore TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ignore ESLint errors
  },
};

export default nextConfig;
