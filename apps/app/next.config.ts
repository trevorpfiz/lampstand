import type { NextConfig } from 'next';

import { env } from '@lamp/env';
import {
  config as baseConfig,
  withAnalyzer,
  withSentry,
} from '@lamp/next-config';

// Import env files to validate at build time
import '@lamp/env';

const appSpecificConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    taint: true,
    // dynamicIO: true,
  },

  /** Enables hot reloading for local packages without a build step */
  transpilePackages: [
    '@lamp/api',
    '@lamp/db',
    '@lamp/ui',
    '@lamp/validators',
    '@lamp/plate',
  ],

  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

// Merge the base config with the app-specific config
let nextConfig: NextConfig = {
  ...baseConfig,
  ...appSpecificConfig,
};

// Apply optional configurations
if (env.VERCEL) {
  nextConfig = withSentry(nextConfig);
}

if (env.ANALYZE === 'true') {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
