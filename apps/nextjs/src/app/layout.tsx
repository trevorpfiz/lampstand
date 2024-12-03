import "~/app/globals.css";

import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@lamp/ui";
import { Toaster } from "@lamp/ui/sonner";
import { ThemeProvider } from "@lamp/ui/theme";

// import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  // metadataBase: new URL(
  //   env.NODE_ENV === "production"
  //     ? env.NEXT_PUBLIC_SITE_URL
  //     : "http://localhost:3000",
  // ),
  metadataBase: new URL("https://getlampstand.com"),
  title: "Lampstand",
  description: "The Simplest Bible Study Platform.",
  openGraph: {
    title: "Lampstand",
    description: "The Simplest Bible Study Platform.",
    // url: env.NEXT_PUBLIC_SITE_URL,
    url: "https://getlampstand.com",
    siteName: "Lampstand",
  },
  twitter: {
    card: "summary_large_image",
    site: "@trevorpfiz",
    creator: "@trevorpfiz",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "h-screen w-full bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
