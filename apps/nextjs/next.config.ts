import type { NextConfig } from "next";

// Import env files to validate at build time
// import "./src/env";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    taint: true,
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@lamp/api", "@lamp/db", "@lamp/ui", "@lamp/validators"],

  // Allow optimizing avatar images from GitHub
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
