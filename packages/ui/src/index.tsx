import { VercelToolbar } from '@vercel/toolbar/next';
import type { ThemeProviderProps } from 'next-themes';

import { AnalyticsProvider } from '@lamp/analytics';
import { env } from '@lamp/env';

import { Toaster } from './components/sonner';
import { TooltipProvider } from './components/tooltip';
import { ThemeProvider } from './providers/theme';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AnalyticsProvider>
      <TooltipProvider delayDuration={50} skipDelayDuration={300}>
        {children}
      </TooltipProvider>
      <Toaster richColors duration={5000} />
      {env.NODE_ENV === 'development' && env.FLAGS_SECRET && <VercelToolbar />}
    </AnalyticsProvider>
  </ThemeProvider>
);
