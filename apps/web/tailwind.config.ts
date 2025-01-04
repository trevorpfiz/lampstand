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
        // FIXME: Why are max-* modifiers not working out-of-the-box?
        // @link https://tailwindcss.com/docs/responsive-design#targeting-a-breakpoint-range
        'max-sm': { max: '639px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '1023px' },
        'max-xl': { max: '1279px' },
        'max-2xl': { max: '1535px' },
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        meteor: 'meteor 5s linear infinite',
      },
      keyframes: {
        gradient: {
          to: {
            backgroundPosition: 'var(--bg-size) 0',
          },
        },
        meteor: {
          '0%': {
            transform: 'rotate(215deg) translateX(0)',
            opacity: '100%',
          },
          '70%': { opacity: '100%' },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: '0%',
          },
        },
      },
    },
  },
} satisfies Config;
