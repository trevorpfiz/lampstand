import type { NextConfig } from "next";

import { env } from "@lamp/env";
import { config, withAnalyzer, withSentry } from "@lamp/next-config";

let nextConfig: NextConfig = { ...config };

if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
