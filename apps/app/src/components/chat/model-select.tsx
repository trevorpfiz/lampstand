'use client';

import { models } from '@lamp/ai/models';
import { Badge } from '@lamp/ui/components/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@lamp/ui/components/select';
import { cn } from '@lamp/ui/lib/utils';
import { UpgradeDialog } from '~/components/billing/upgrade-dialog';

import { usePricingDialogStore } from '~/providers/pricing-dialog-store-provider';
import { api } from '~/trpc/react';

interface ModelSelectProps {
  modelId: string;
  onModelChange: (value: string) => void;
}

export function ModelSelect({ modelId, onModelChange }: ModelSelectProps) {
  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();
  const openUpgradeDialog = usePricingDialogStore(
    (state) => state.openUpgradeDialog
  );

  const handleModelChange = (value: string) => {
    const selectedModel = models.find((model) => model.id === value);
    if (selectedModel?.premium && subscription?.status !== 'active') {
      openUpgradeDialog();
      return;
    }
    onModelChange(value);
  };

  return (
    <>
      <Select value={modelId} onValueChange={handleModelChange}>
        <SelectTrigger
          id="model-select"
          className={cn(
            'h-6 w-auto min-w-12 max-w-full gap-1 border-0 bg-transparent px-1.5 font-medium text-muted-foreground/70 text-sm shadow-none',
            'focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0',
            '[&>span]:line-clamp-1 [&>span]:flex-1 [&>span]:text-left',
            '[&_[data-premium]]:hidden'
          )}
        >
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="flex w-full items-center justify-between pr-2"
              badge={
                model.premium ? (
                  <Badge
                    variant="default"
                    className="ml-2 flex-shrink-0 gap-1 rounded"
                    data-premium
                  >
                    Pro
                  </Badge>
                ) : undefined
              }
            >
              {model.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <UpgradeDialog />
    </>
  );
}
