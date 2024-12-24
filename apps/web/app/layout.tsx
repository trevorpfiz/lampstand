import '@lamp/design-system/styles/globals.css';
import './styles/web.css';

import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@lamp/design-system';
import { fonts } from '@lamp/design-system/lib/fonts';
import { cn } from '@lamp/design-system/lib/utils';

import { Footer } from './components/footer';
import { Header } from './components/header';

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
        <Footer />
      </DesignSystemProvider>
    </body>
  </html>
);

export default RootLayout;
