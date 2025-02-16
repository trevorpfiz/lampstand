import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { env } from '@lamp/env';
import { secure } from '@lamp/security';
import { Button } from '@lamp/ui/components/button';

const webUrl =
  env.NODE_ENV === 'development'
    ? 'http://localhost:3001'
    : env.NEXT_PUBLIC_SITE_URL;

export default async function AuthLayout({
  children,
}: { children: ReactNode }) {
  if (env.ARCJET_KEY) {
    await secure(['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW']);
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center overflow-hidden bg-background px-4 py-6">
      <div className="absolute top-8 left-8 z-10">
        <Button asChild className="group" variant="ghost">
          <Link href={webUrl ?? '/'}>
            <ArrowLeft
              className="-ms-1 group-hover:-translate-x-0.5 me-2 opacity-60 transition-transform"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Back
          </Link>
        </Button>
      </div>

      <div className="relative flex w-full max-w-96 flex-1 flex-col justify-center gap-6">
        <main className="flex-1 content-center">{children}</main>

        <footer className="flex justify-between">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Lampstand
          </p>

          <ul className="flex gap-2">
            <li className="flex items-center gap-2 after:size-0.5 after:rounded-full after:bg-muted-foreground last:after:hidden">
              <a
                href={`mailto:${env.NEXT_PUBLIC_EMAIL}`}
                className="after:-inset-x-1 after:-inset-y-0.5 relative rounded-sm text-muted-foreground text-sm after:absolute after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Support
              </a>
            </li>
            <li className="flex items-center gap-2 after:size-0.5 after:rounded-full after:bg-muted-foreground last:after:hidden">
              <Link
                href={`${webUrl}/privacy`}
                className="after:-inset-x-1 after:-inset-y-0.5 relative rounded-sm text-muted-foreground text-sm after:absolute after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Privacy
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href={`${webUrl}/terms`}
                className="after:-inset-x-1 after:-inset-y-0.5 relative rounded-sm text-muted-foreground text-sm after:absolute after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Terms
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
