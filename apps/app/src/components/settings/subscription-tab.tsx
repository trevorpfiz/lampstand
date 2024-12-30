'use client';

import { BadgePlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { parseError } from '@lamp/observability/error';
import { Button } from '@lamp/ui/components/button';
import { Spinner } from '@lamp/ui/components/spinner';
import { createStripePortal } from '~/lib/actions/stripe';
import { api } from '~/trpc/react';

interface SubscriptionTabProps {
  userEmail: string;
  userId: string;
}

export function SubscriptionTab({ userEmail, userId }: SubscriptionTabProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();

  const subscriptionPrice =
    subscription?.price &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription.price.currency ?? undefined,
      minimumFractionDigits: 0,
    }).format((subscription.price.unitAmount ?? 0) / 100);

  const handleStripePortalRequest = async () => {
    try {
      setIsLoading(true);
      const portalUrl = await createStripePortal({
        userId,
        email: userEmail,
      });
      router.push(portalUrl);
    } catch (error) {
      parseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="flex flex-col gap-6 pt-5 pr-6 pb-6 pl-0">
      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-lg">Plan & Billing</h3>
        <p className="text-muted-foreground text-sm">
          {subscription
            ? `You are currently on the ${subscription.price?.product?.name} plan.`
            : 'You are not currently subscribed to any plan.'}
        </p>
      </div>

      {subscription && (
        <div className="flex flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <BadgePlus size={16} strokeWidth={2} />
                <span className="font-medium">
                  {subscription.price?.product?.name}
                </span>
              </div>
              <div className="text-muted-foreground text-sm">
                {subscriptionPrice}/{subscription.price?.interval}
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              {subscription.cancelAtPeriodEnd ? 'Cancels on ' : 'Renews on '}
              {renewalDate}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <p className="text-base">Payment</p>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={handleStripePortalRequest}
          disabled={isLoading}
        >
          {isLoading && <Spinner className="-ms-1 me-2" />}
          Manage
        </Button>
      </div>
    </div>
  );
}
