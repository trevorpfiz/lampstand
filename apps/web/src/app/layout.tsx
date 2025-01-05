import '@lamp/ui/styles/globals.css';
import '~/components/craft/craft.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { createMetadata } from '@lamp/seo/metadata';
import { DesignSystemProvider } from '@lamp/ui';
import { Separator } from '@lamp/ui/components/separator';
import { fonts } from '@lamp/ui/lib/fonts';
import { cn } from '@lamp/ui/lib/utils';

import { Container } from '~/components/craft';
import Footer from '~/components/craft/footer';
import Header from '~/components/tailwindui/header';
import { webUrl } from '~/lib/constants';

const meta = {
  metadataBase: new URL(webUrl),
  title: 'Bible study for the next generation',
  description:
    'Lampstand is an AI-powered Bible study app for the next generation of believers. Quickly find verses, simplify complex topics, write with AI, and keep everything organized.',
  applicationFirst: true,
};

export const metadata: Metadata = createMetadata(meta);

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body className="bg-background text-foreground">
      <DesignSystemProvider>
        <Header />
        {children}
        <Container>
          <Separator className="bg-muted" />
        </Container>
        <Footer />
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
