'use client';

import { models } from '@lamp/ai/models';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lamp/ui/components/select';
import { cn } from '@lamp/ui/lib/utils';

import { api } from '~/trpc/react';

interface ModelSelectProps {
  modelId: string;
  onModelChange: (value: string) => void;
}

export function ModelSelect({ modelId, onModelChange }: ModelSelectProps) {
  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();

  return (
    <Select value={modelId} onValueChange={onModelChange}>
      <SelectTrigger
        id="model-select"
        className={cn(
          'h-6 w-auto min-w-12 max-w-full gap-1 border-0 bg-transparent px-1.5 font-medium text-muted-foreground/70 text-sm shadow-none',
          'focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0',
          '[&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-left'
        )}
      >
        <SelectValue placeholder="Select model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            disabled={model.premium && subscription?.status !== 'active'}
          >
            {model.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
