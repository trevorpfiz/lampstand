'use client';

import { Check, Info, Sparkles } from 'lucide-react';
import { useState } from 'react';

import type { Price, ProductWithDetails } from '@lamp/db/schema';
import { type BillingInterval, mockPlans } from '@lamp/payments/constants';
import { Badge } from '@lamp/ui/components/badge';
import { Button } from '@lamp/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lamp/ui/components/card';
import { Spinner } from '@lamp/ui/components/spinner';
import { Tabs, TabsList, TabsTrigger } from '@lamp/ui/components/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { cn } from '@lamp/ui/lib/utils';
import { useTheme } from '@lamp/ui/providers/theme';

import { api } from '~/trpc/react';

interface PricingTablesProps {
  products: ProductWithDetails[];
  priceIdLoading?: string;
  onPriceSelect: (price: Price) => void;
}

export default function PricingTables({
  products,
  priceIdLoading,
  onPriceSelect,
}: PricingTablesProps) {
  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();

  const { resolvedTheme } = useTheme();

  // Get available intervals from products, defaulting to month/year if none found
  const availableIntervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product.prices?.map((price) => price.interval)
      )
    )
  ).filter(
    (interval): interval is BillingInterval =>
      interval !== null && ['month', 'year'].includes(interval)
  );

  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    availableIntervals.includes('month') ? 'month' : 'year'
  );

  const getDisplayInterval = (interval: BillingInterval) =>
    interval === 'month' ? 'monthly' : 'yearly';

  const getPrice = (monthlyPrice: number, yearlyPrice: number) => {
    return billingInterval === 'month' ? `$${monthlyPrice}` : `$${yearlyPrice}`;
  };

  const getPeriod = () => `/${billingInterval}`;

  // Convert Stripe products to our PricingPlan format
  const plans =
    products.length > 0
      ? products
          .map((product) => {
            const monthlyPrice = product.prices.find(
              (price) => price.interval === 'month'
            );
            const yearlyPrice = product.prices.find(
              (price) => price.interval === 'year'
            );

            // Get features based on plan name
            const defaultFeatures = mockPlans[0]?.features || [];

            const getMatchingMockPlan = (productName: string) => {
              if (!productName) {
                return mockPlans[0];
              }

              const planName = productName.toLowerCase();
              return mockPlans.find((plan) =>
                planName.includes(plan.name.toLowerCase())
              );
            };

            const matchingMockPlan = getMatchingMockPlan(product.name || '');

            // Get features from mock plan
            const features = matchingMockPlan?.features || defaultFeatures;

            // Get sort order from metadata or default to 99
            const order =
              product.metadata && typeof product.metadata === 'object'
                ? Number.parseInt(
                    (product.metadata as { order?: string })?.order || '99',
                    10
                  )
                : 99;

            // Determine if it's a free plan
            const isFree =
              monthlyPrice?.unitAmount === 0 ||
              (product.name?.toLowerCase() || '').includes('free');

            // Check if this is the user's current plan or a lower tier plan
            const isIncludedInCurrentPlan = () => {
              if (!subscription) {
                return false;
              }
              const planOrder = {
                Free: 1,
                Pro: 2,
                Premium: 3,
              } as const;

              const currentPlanName =
                subscription.price?.product?.name?.split(' ').at(-1) || '';
              const thisPlanName = product.name?.split(' ').at(-1) || '';

              const currentPlanOrder =
                planOrder[currentPlanName as keyof typeof planOrder] ?? 0;
              const thisPlanOrder =
                planOrder[thisPlanName as keyof typeof planOrder] ?? 0;

              return thisPlanOrder < currentPlanOrder;
            };

            const isCurrentPlan =
              (subscription === undefined && isFree) || // If no subscription, Free plan is current
              (subscription?.price?.productId === product.id && // Product matches subscription
                subscription?.price?.interval === billingInterval); // And billing period matches

            const isIncluded = isIncludedInCurrentPlan();

            // Get the current price based on billing period
            const currentPrice =
              billingInterval === 'month' ? monthlyPrice : yearlyPrice;

            return {
              name: (product.name || '').split(' ').at(-1) || '',
              description:
                product.description || matchingMockPlan?.description || '',
              monthlyPrice: monthlyPrice
                ? (monthlyPrice.unitAmount || 0) / 100
                : 0,
              yearlyPrice: yearlyPrice
                ? (yearlyPrice.unitAmount || 0) / 100
                : 0,
              buttonText: isCurrentPlan
                ? 'Your current plan'
                : `Get ${(product.name || '').split(' ').at(-1)}`,
              features,
              popular:
                product.metadata && typeof product.metadata === 'object'
                  ? (product.metadata as { popular?: string })?.popular ===
                    'true'
                  : false,
              order,
              isCurrentPlan,
              currentPrice,
              isFree,
              isIncluded,
            };
          })
          .sort((a, b) => (a.order || 99) - (b.order || 99))
      : mockPlans;

  return (
    <div>
      <Tabs
        defaultValue={billingInterval}
        onValueChange={(value) => setBillingInterval(value as BillingInterval)}
        className="mb-8"
      >
        <TabsList className="mx-auto grid w-full max-w-[400px] grid-cols-2">
          {availableIntervals.includes('month') && (
            <TabsTrigger value="month">
              Pay {getDisplayInterval('month')}
            </TabsTrigger>
          )}
          {availableIntervals.includes('year') && (
            <TabsTrigger value="year" className="relative">
              Pay {getDisplayInterval('year')}
              <span className="-top-10 -end-4 md:-end-10 absolute start-auto">
                <span className="flex items-center">
                  <svg
                    className="-me-6 h-8 w-14"
                    width={45}
                    height={25}
                    viewBox="0 0 45 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Curved arrow pointing to yearly pricing"
                  >
                    <title>Curved arrow pointing to yearly pricing</title>
                    <path
                      d="M43.2951 3.47877C43.8357 3.59191 44.3656 3.24541 44.4788 2.70484C44.5919 2.16427 44.2454 1.63433 43.7049 1.52119L43.2951 3.47877ZM4.63031 24.4936C4.90293 24.9739 5.51329 25.1423 5.99361 24.8697L13.8208 20.4272C14.3011 20.1546 14.4695 19.5443 14.1969 19.0639C13.9242 18.5836 13.3139 18.4152 12.8336 18.6879L5.87608 22.6367L1.92723 15.6792C1.65462 15.1989 1.04426 15.0305 0.563943 15.3031C0.0836291 15.5757 -0.0847477 16.1861 0.187863 16.6664L4.63031 24.4936ZM43.7049 1.52119C32.7389 -0.77401 23.9595 0.99522 17.3905 5.28788C10.8356 9.57127 6.58742 16.2977 4.53601 23.7341L6.46399 24.2659C8.41258 17.2023 12.4144 10.9287 18.4845 6.96211C24.5405 3.00476 32.7611 1.27399 43.2951 3.47877L43.7049 1.52119Z"
                      fill="currentColor"
                      className="text-muted-foreground"
                    />
                  </svg>
                  <Badge className="mt-3 bg-blue-500">Save 20%</Badge>
                </span>
              </span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>

      <div
        className={cn(
          'mx-auto grid max-w-5xl gap-8',
          plans.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
        )}
      >
        {plans.map((plan) => (
          <Card key={plan.name} className="flex max-w-80 flex-col">
            <CardHeader className="gap-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                {plan.popular && (
                  <Badge className="gap-1 bg-blue-500 px-2">
                    Most popular
                    <Sparkles
                      className="opacity-60"
                      size={12}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {plan.description}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-4xl">
                  {getPrice(plan.monthlyPrice, plan.yearlyPrice)}
                </span>
                <span className="text-muted-foreground">{getPeriod()}</span>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <Button
                variant={
                  plan.isCurrentPlan || plan.isIncluded || plan.isFree
                    ? 'secondary'
                    : 'default'
                }
                className="mb-8 w-full"
                disabled={
                  plan.isCurrentPlan ||
                  !plan.currentPrice ||
                  priceIdLoading === plan.currentPrice?.id ||
                  plan.isFree || // Always disable Free plan button
                  plan.isIncluded
                }
                onClick={() =>
                  plan.currentPrice && onPriceSelect(plan.currentPrice)
                }
              >
                {priceIdLoading === plan.currentPrice?.id && (
                  <Spinner className="-ms-1 me-2" />
                )}
                {plan.isIncluded ? 'Already included' : plan.buttonText}
              </Button>
              <div className="space-y-4">
                {plan.popular && (
                  <p className="font-medium text-sm">
                    Everything in Free, plus:
                  </p>
                )}
                {plan.name === 'Premium' && (
                  <p className="font-medium text-sm">
                    Everything in Pro, plus:
                  </p>
                )}

                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          size={16}
                          strokeWidth={2}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="text-sm">{feature.name}</span>
                      </div>

                      {feature.tooltip && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground opacity-60" />
                          </TooltipTrigger>
                          <TooltipContent
                            showArrow={true}
                            className={cn(
                              '',
                              resolvedTheme === 'light' && 'dark'
                            )}
                          >
                            <p className="text-sm">{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
