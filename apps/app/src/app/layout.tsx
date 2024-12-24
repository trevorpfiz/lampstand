import '~/app/globals.css';

import type { Metadata, Viewport } from 'next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { env } from '@lamp/env';
import { createMetadata } from '@lamp/seo/metadata';
import { DesignSystemProvider } from '@lamp/ui';
import { fonts } from '@lamp/ui/lib/fonts';

import type { ReactNode } from 'react';
import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = createMetadata({
  metadataBase: new URL(
    env.NODE_ENV === 'production'
      ? env.NEXT_PUBLIC_APP_URL
      : 'http://localhost:3000'
  ),
  title: 'Dashboard',
  description: 'Shine light on your Bible study.',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <body className="h-screen w-full bg-background text-foreground">
        <DesignSystemProvider>
          <TRPCReactProvider>
            <NuqsAdapter>{props.children}</NuqsAdapter>
          </TRPCReactProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
