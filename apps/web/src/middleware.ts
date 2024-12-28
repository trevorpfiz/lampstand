import { type NextRequest, NextResponse } from 'next/server';

import { env } from '@lamp/env';
import { parseError } from '@lamp/observability/error';
import { secure } from '@lamp/security';
import { noseconeConfig, noseconeMiddleware } from '@lamp/security/middleware';

// Clerk matcher: https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params. Also skip Sentry tunnel route and Posthog ingest.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|monitoring|ingest).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

const securityHeaders = noseconeMiddleware(noseconeConfig);

export async function middleware(request: NextRequest) {
  if (!env.ARCJET_KEY) {
    return securityHeaders();
  }

  try {
    await secure(
      [
        // See https://docs.arcjet.com/bot-protection/identifying-bots
        'CATEGORY:SEARCH_ENGINE', // Allow search engines
        'CATEGORY:PREVIEW', // Allow preview links to show OG images
      ],
      request
    );

    return securityHeaders();
  } catch (error) {
    const message = parseError(error);

    return NextResponse.json({ error: message }, { status: 403 });
  }
}
