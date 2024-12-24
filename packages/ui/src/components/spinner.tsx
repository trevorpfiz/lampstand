import type { LucideProps } from "lucide-react";
import { LoaderCircle } from "lucide-react";

import { cn } from "@lamp/ui/lib/utils";

function Spinner({
  className,
  size = 16,
  strokeWidth = 2,
  ...props
}: LucideProps) {
  return (
    <LoaderCircle
      className={cn("animate-spin text-muted-foreground", className)}
      size={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      {...props}
    />
  );
}

Spinner.displayName = "Spinner";

export { Spinner };
