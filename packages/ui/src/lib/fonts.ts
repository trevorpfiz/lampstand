import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { cn } from '@lamp/ui/lib/utils';

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  'touch-manipulation font-sans antialiased'
);
