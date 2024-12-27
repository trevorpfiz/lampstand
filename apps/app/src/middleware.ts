import type {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from 'next/server';
import { match } from 'path-to-regexp';

import { noseconeConfig, noseconeMiddleware } from '@lamp/security/middleware';
import { updateSession } from '@lamp/supabase/middleware';

// Clerk matcher: https://clerk.com/docs/references/nextjs/auth-middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params. Also skip Sentry tunnel route and Posthog ingest.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)|monitoring|ingest).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

// TODO: @link https://github.com/arcjet/arcjet-js/issues/2639
// Nosecone middleware
const securityHeaders = noseconeMiddleware(noseconeConfig);

// Supabase middleware
async function supabaseMiddleware(request: NextRequest) {
  return await updateSession(request);
}

// Add any paths you want to run different middleware for. They use
// path-to-regexp which is the same as the Next.js config. You can provide a
// single middleware or an array of middlewares.
export default router({
  // Run nosecone middleware on any path
  '/{*path}': [securityHeaders, supabaseMiddleware],
});

// A simple middleware router that allows you to run different middleware based
// on the path of the request.
function router(
  pathMiddlewareMap: Record<string, NextMiddleware | NextMiddleware[]>
): NextMiddleware {
  const middleware = Object.entries(pathMiddlewareMap).map(
    ([path, middleware]) => {
      if (Array.isArray(middleware)) {
        return [match(path), middleware] as const;
      }
      return [match(path), [middleware]] as const;
    }
  );

  return async (
    request: NextRequest,
    event: NextFetchEvent
  ): Promise<NextResponse | Response> => {
    const path = request.nextUrl.pathname || '/';
    const addedHeaders = new Headers();

    for (const [matchFunc, middlewareFuncs] of middleware) {
      const m = matchFunc(path);
      if (m) {
        for (const fn of middlewareFuncs) {
          const resp = await fn(request, event);
          // TODO: better response guards
          if (typeof resp !== 'undefined' && resp !== null) {
            // If it's a redirect or auth status, bail immediately.
            if (resp.status >= 300 && resp.status < 500) {
              return resp;
            }

            resp.headers.forEach((value, key) => {
              addedHeaders.set(key, value);
            });
          }
        }
      }
    }

    addedHeaders.set('x-middleware-next', '1');

    return new Response(null, {
      headers: addedHeaders,
    });
  };
}
