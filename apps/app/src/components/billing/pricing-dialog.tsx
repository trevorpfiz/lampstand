'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import type {
  Price,
  ProductWithDetails,
  SubscriptionWithDetails,
} from '@lamp/db/schema';
import {
  Dialog,
  DialogContentFullscreen,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@lamp/ui/components/dialog';

import { getErrorRedirect } from '@lamp/payments/utils';
import PricingTables from '~/components/billing/pricing-tables';
import { checkoutWithStripe } from '~/lib/actions/stripe';
import { usePricingDialogStore } from '~/providers/pricing-dialog-store-provider';

interface PricingDialogProps {
  products: ProductWithDetails[];
  subscription: SubscriptionWithDetails | null | undefined;
  userId: string;
  userEmail: string;
}

export function PricingDialog({
  products,
  subscription,
  userId,
  userEmail,
}: PricingDialogProps) {
  const router = useRouter();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const isOpen = usePricingDialogStore((state) => state.isOpen);
  const closePricingDialog = usePricingDialogStore(
    (state) => state.closePricingDialog
  );

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    const { errorRedirect, checkoutUrl } = await checkoutWithStripe({
      price,
      userId,
      email: userEmail,
      redirectPath: currentPath,
    });

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!checkoutUrl) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    router.push(checkoutUrl);
    setPriceIdLoading(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={closePricingDialog}>
      <DialogContentFullscreen>
        <div className="flex-grow overflow-y-auto p-6">
          <div className="relative grid grid-cols-[1fr_auto_1fr] px-6 py-4 md:pt-[4.5rem] md:pb-10">
            <div />
            <DialogHeader>
              <DialogTitle className="mt-1 mb-1 font-semibold text-2xl md:mt-0 md:mb-0 md:text-4xl">
                Upgrade your plan
              </DialogTitle>
              <DialogDescription className="hidden">
                Pick one of the following plans.
              </DialogDescription>
            </DialogHeader>
            <div />
          </div>

          <div className="flex flex-col items-center justify-center pt-8">
            <PricingTables
              products={products}
              subscription={subscription}
              priceIdLoading={priceIdLoading}
              onPriceSelect={handleStripeCheckout}
            />
          </div>

          <div className="relative grid grid-cols-[1fr_auto_1fr]">
            <div />
            <div className="mt-8 mb-12 flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm md:mt-8 md:mb-8">
              <div className="flex flex-col items-center justify-center">
                Need help with billing?
                <div>
                  <a
                    className="underline"
                    href="mailto:trevor@getlampstand.com"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Contact us
                  </a>
                </div>
              </div>
            </div>
            <div />
          </div>
        </div>
      </DialogContentFullscreen>
    </Dialog>
  );
}
