import '@lamp/ui/styles/globals.css';
import '~/components/craft/craft.css';

import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@lamp/ui';
import { Separator } from '@lamp/ui/components/separator';
import { fonts } from '@lamp/ui/lib/fonts';
import { cn } from '@lamp/ui/lib/utils';
import { Container } from '~/components/craft';
import Footer from '~/components/craft/footer';
import Header from '~/components/tailwindui/header';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body>
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
