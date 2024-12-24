import { CheckCircle } from 'lucide-react';

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-lg bg-emerald-500/15 px-4 py-3 text-emerald-500 text-sm">
      <div className="flex gap-3">
        <CheckCircle
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
