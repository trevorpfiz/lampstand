import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar-hide';
import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';
import plugin from 'tailwindcss/plugin';

import base from './base';

export default {
  darkMode: ['class'],
  content: base.content,
  presets: [base],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      colors: {
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          foreground: 'hsl(var(--brand-foreground))',
        },
        highlight: {
          DEFAULT: 'hsl(var(--highlight))',
          foreground: 'hsl(var(--highlight-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
    },
  },
  plugins: [
    animate,
    typography,
    scrollbar,
    // Fallback for Safari 14
    plugin(({ addUtilities }) => {
      const fallbackHeightUtilities = {
        '@supports not (height: 100dvh)': {
          '.h-dvh': { height: '100vh' },
          '.min-h-dvh': { 'min-height': '100vh' },
          '.max-h-dvh': { 'max-height': '100vh' },
        },
        '@supports not (height: 100lvh)': {
          '.h-lvh': { height: '100vh' },
          '.min-h-lvh': { 'min-height': '100vh' },
          '.max-h-lvh': { 'max-height': '100vh' },
        },
        '@supports not (height: 100svh)': {
          '.h-svh': { height: '100vh' },
          '.min-h-svh': { 'min-height': '100vh' },
          '.max-h-svh': { 'max-height': '100vh' },
        },
      };

      addUtilities(fallbackHeightUtilities);
    }),
  ],
} satisfies Config;
