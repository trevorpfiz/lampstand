import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@lamp/ui";

const inputVariants = cva(
  "flex w-full disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: [
          "h-9 rounded-lg border border-input bg-background px-3 py-2",
          "text-sm text-foreground shadow-sm shadow-black/5",
          "transition-shadow placeholder:text-muted-foreground/70",
          "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
        ],
        title: [
          "h-auto resize-none break-words rounded-none border-none bg-transparent",
          "p-0 font-bold leading-none text-foreground shadow-none outline-none",
          "placeholder:text-muted-foreground/80 md:text-[40px]",
          "[&:read-only]:ring-0 [&:read-only]:focus:border-input",
        ],
      },
      inputType: {
        default: "",
        search: [
          "[&::-webkit-search-cancel-button]:appearance-none",
          "[&::-webkit-search-decoration]:appearance-none",
          "[&::-webkit-search-results-button]:appearance-none",
          "[&::-webkit-search-results-decoration]:appearance-none",
        ],
        file: [
          "p-0 pr-3 italic text-muted-foreground/70",
          "file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input",
          "file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
      inputType: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  inputType?: "default" | "search" | "file";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputType, ...props }, ref) => {
    // Set inputType based on the type prop if not explicitly provided
    const resolvedInputType =
      inputType ?? (type as "search" | "file" | "default");

    return (
      <input
        type={type}
        className={cn(
          inputVariants({ variant, inputType: resolvedInputType, className }),
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
