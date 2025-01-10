'use client';

import { Check } from 'lucide-react';

import { Button } from '@lamp/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lamp/ui/components/dialog';

import { usePricingDialogStore } from '~/providers/pricing-dialog-store-provider';

export function UpgradeDialog() {
  const isOpen = usePricingDialogStore((state) => state.isUpgradeOpen);
  const closeUpgradeDialog = usePricingDialogStore(
    (state) => state.closeUpgradeDialog
  );
  const openPricingDialog = usePricingDialogStore(
    (state) => state.openPricingDialog
  );

  const handleUpgrade = () => {
    closeUpgradeDialog();
    openPricingDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeUpgradeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="max-w-[238px] text-balance text-left text-2xl">
            Upgrade for access to the best AI models
          </DialogTitle>
          <DialogDescription className="max-w-[238px] text-balance text-left">
            Unlock an even better Lampstand experience with Premium features.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 font-medium text-primary text-sm">
          <li className="flex gap-2">
            <Check
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-muted-foreground opacity-60"
              aria-hidden="true"
            />
            Access to GPT-4o
          </li>
          <li className="flex gap-2">
            <Check
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-muted-foreground opacity-60"
              aria-hidden="true"
            />
            Unlimited messages
          </li>
          <li className="flex gap-2">
            <Check
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-muted-foreground opacity-60"
              aria-hidden="true"
            />
            Early access to new features
          </li>
          <li className="flex gap-2">
            <Check
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-muted-foreground opacity-60"
              aria-hidden="true"
            />
            Priority customer support
          </li>
        </ul>

        <div className="flex flex-col items-center justify-center gap-2 pt-24">
          <Button
            size="lg"
            className="w-full rounded-full"
            onClick={handleUpgrade}
          >
            Upgrade
          </Button>
          <span className="text-muted-foreground text-sm">{`You won't get charged yet`}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
