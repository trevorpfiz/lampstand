import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

import baseConfig from '@lamp/tailwind-config/web';

export default {
  darkMode: ['class'],
  // We need to append the path to the UI package to the content array so that
  // those classes are included correctly.
  content: [
    ...baseConfig.content,
    '../../packages/ui/src/**/*.{tsx,ts,js,jsx}',
    '../../packages/plate/src/**/*.{tsx,ts,js,jsx}',
  ],
  presets: [baseConfig],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', ...fontFamily.sans],
        mono: ['var(--font-geist-mono)', ...fontFamily.mono],
      },
      screens: {
        'main-hover': {
          raw: '(hover: hover)',
        },
      },
    },
  },
} satisfies Config;
