import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disabling ESLint checks during build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
