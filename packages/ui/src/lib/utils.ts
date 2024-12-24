import { cx } from 'class-variance-authority';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

import { parseError } from '@lamp/observability/error';

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};

export { cn, handleError };
