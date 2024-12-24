import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";

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

export { ThemeProvider, useTheme };
