import type { MetadataRoute } from 'next';

import { env } from '@lamp/env';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', env.VERCEL_PROJECT_PRODUCTION_URL).href,
  };
}
