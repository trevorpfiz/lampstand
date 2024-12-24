import type { SlateElementProps } from '@udecode/plate-common';

import { cn } from '@udecode/cn';
import { SlateElement } from '@udecode/plate-common';
import { cva } from 'class-variance-authority';

interface HeadingElementViewProps extends SlateElementProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const headingVariants = cva('relative mb-1', {
  variants: {
    variant: {
      h1: 'mt-[1.6em] pb-1 font-bold font-heading text-4xl',
      h2: 'mt-[1.4em] pb-px font-heading font-semibold text-2xl tracking-tight',
      h3: 'mt-[1em] pb-px font-heading font-semibold text-xl tracking-tight',
      h4: 'mt-[0.75em] font-heading font-semibold text-lg tracking-tight',
      h5: 'mt-[0.75em] font-semibold text-lg tracking-tight',
      h6: 'mt-[0.75em] font-semibold text-base tracking-tight',
    },
  },
});

export const HeadingElementStatic = ({
  children,
  className,
  variant = 'h1',
  ...props
}: HeadingElementViewProps) => {
  return (
    <SlateElement
      as={variant}
      className={cn(className, headingVariants({ variant }))}
      {...props}
    >
      {children}
    </SlateElement>
  );
};
