import { CircleAlert } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg bg-destructive/15 px-4 py-3 text-destructive dark:bg-destructive dark:text-destructive-foreground">
      <div className="flex gap-3">
        <CircleAlert
          className="mt-0.5 shrink-0 opacity-60"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
        <div className="grow space-y-1">
          <p className="text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
};
