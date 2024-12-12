import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@lamp/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background px-4 py-6">
      <div className="absolute left-8 top-8">
        <Button asChild className="group" variant="ghost">
          <Link href="/">
            <ArrowLeft
              className="-ms-1 me-2 opacity-60 transition-transform group-hover:-translate-x-0.5"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            Back
          </Link>
        </Button>
      </div>

      <div className="relative flex w-full max-w-96 flex-1 flex-col justify-center gap-6">
        <main className="flex-1 content-center">{children}</main>

        <footer className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Lampstand
          </p>

          <ul role="list" className="flex gap-2">
            <li className="flex items-center gap-2 after:size-0.5 after:rounded-full after:bg-muted-foreground last:after:hidden">
              <a
                href="mailto:trevor@getlampstand.com"
                className="relative rounded-sm text-sm text-muted-foreground after:absolute after:-inset-x-1 after:-inset-y-0.5 after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Support
              </a>
            </li>
            <li className="flex items-center gap-2 after:size-0.5 after:rounded-full after:bg-muted-foreground last:after:hidden">
              <Link
                href="/privacy"
                className="relative rounded-sm text-sm text-muted-foreground after:absolute after:-inset-x-1 after:-inset-y-0.5 after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Privacy
              </Link>
            </li>
            <li className="flex items-center gap-2">
              <Link
                href="/terms"
                className="relative rounded-sm text-sm text-muted-foreground after:absolute after:-inset-x-1 after:-inset-y-0.5 after:rounded-sm after:border-2 after:border-primary after:opacity-0 hover:text-foreground focus-visible:after:opacity-100"
              >
                Terms
              </Link>
            </li>
          </ul>
        </footer>
      </div>
    </div>
  );
}
