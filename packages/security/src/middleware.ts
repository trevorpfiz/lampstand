import type { NoseconeOptions } from '@nosecone/next';
import {
  defaults as noseconeDefaults,
  withVercelToolbar,
} from '@nosecone/next';

import { env } from '@lamp/env';

export { createMiddleware as noseconeMiddleware } from '@nosecone/next';

// Nosecone security headers configuration
// https://docs.arcjet.com/nosecone/quick-start
const noseconeOptions: NoseconeOptions = {
  ...noseconeDefaults,
  // Content Security Policy (CSP) is disabled by default because the values
  // depend on which Next Forge features are enabled. See
  // https://docs.next-forge.com/features/security/headers for guidance on how
  // to configure it.
  contentSecurityPolicy: {
    ...noseconeDefaults.contentSecurityPolicy,
    directives: {
      ...noseconeDefaults.contentSecurityPolicy.directives,
      scriptSrc: [
        // We have to use unsafe-inline because next-themes and Vercel Analytics
        // do not support nonce
        // https://github.com/pacocoursey/next-themes/issues/106
        // https://github.com/vercel/analytics/issues/122
        //...noseconeDefaults.contentSecurityPolicy.directives.scriptSrc,
        "'self'",
        "'unsafe-inline'",
        'https://www.googletagmanager.com',
        'https://va.vercel-scripts.com',
        'https://*.supabase.co',
        'https://*.stripe.com',
        'https://billing.stripe.com',
        'https://checkout.stripe.com',
        'https://*.js.stripe.com',
        'https://js.stripe.com',
        'https://maps.googleapis.com',
      ],
      connectSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.connectSrc,
        'https://*.google-analytics.com',
        'https://*.supabase.co',
        'wss://*.supabase.co',
        'https://basehub.com',
        'https://*.basehub.com',
        'wss://ws-mt1.pusher.com',
        'https://*.stripe.com',
        'https://billing.stripe.com',
        'https://checkout.stripe.com',
        'https://api.stripe.com',
        'https://maps.googleapis.com',
      ],
      workerSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.workerSrc,
        'blob:',
        'https://*.supabase.co',
      ],
      imgSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.imgSrc,
        'https://lh3.googleusercontent.com',
        'https://*.supabase.co',
        'https://github.com',
        'https://avatars.githubusercontent.com',
        'https://*.basehub.com',
        'https://*.stripe.com',
      ],
      objectSrc: [
        ...noseconeDefaults.contentSecurityPolicy.directives.objectSrc,
      ],
      frameSrc: [
        "'self'",
        'https://*.stripe.com',
        'https://checkout.stripe.com',
        'https://*.js.stripe.com',
        'https://js.stripe.com',
        'https://hooks.stripe.com',
      ],
      // We only set this in production because the server may be started
      // without HTTPS
      upgradeInsecureRequests: process.env.NODE_ENV === 'production',
    },
  },
  // Will allow lh3.googleusercontent.com images from Google Auth
  crossOriginEmbedderPolicy: {
    policy: 'credentialless',
  },
};

export const noseconeConfig: NoseconeOptions =
  env.NODE_ENV === 'development' && env.FLAGS_SECRET
    ? withVercelToolbar(noseconeOptions)
    : noseconeOptions;
