import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const ThemeProvider = ({ children, ...properties }: ThemeProviderProps) => (
  <NextThemeProvider
    attribute="class"
    defaultTheme="light"
    enableSystem
    disableTransitionOnChange
    {...properties}
  >
    {children}
  </NextThemeProvider>
);

export { ThemeProvider };
export { useTheme } from 'next-themes';
