import '@lamp/ui/styles/globals.css';
import './styles/web.css';

import type { ReactNode } from 'react';

import { DesignSystemProvider } from '@lamp/ui';
import { fonts } from '@lamp/ui/lib/fonts';
import { cn } from '@lamp/ui/lib/utils';

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
