import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Source_Sans_3 } from 'next/font/google';

import { cn } from '@lamp/ui/lib/utils';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans-3',
});

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  sourceSans3.variable,
  'touch-manipulation font-sans antialiased'
);
