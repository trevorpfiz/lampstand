import type { NextRequest } from 'next/server';

import { noseconeConfig, noseconeMiddleware } from '@lamp/security/middleware';
import { updateSession } from '@lamp/supabase/middleware';

// TODO: @link https://github.com/arcjet/arcjet-js/issues/2639
const _securityHeaders = noseconeMiddleware(noseconeConfig);

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
// Clerk matcher: https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Skip Sentry tunnel route
    '/((?!monitoring).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
