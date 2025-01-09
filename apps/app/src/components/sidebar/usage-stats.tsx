'use client';

import { Info, Sparkles } from 'lucide-react';

import { FREE_USAGE_LIMIT } from '@lamp/ai/models';
import { Badge } from '@lamp/ui/components/badge';
import { Button } from '@lamp/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@lamp/ui/components/card';
import { Progress } from '@lamp/ui/components/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lamp/ui/components/tooltip';
import { cn } from '@lamp/ui/lib/utils';
import { useTheme } from '@lamp/ui/providers/theme';
import { usePricingDialogStore } from '~/providers/pricing-dialog-store-provider';
import { api } from '~/trpc/react';

export function UsageStats() {
  const openPricingDialog = usePricingDialogStore(
    (state) => state.openPricingDialog
  );

  const [{ profile }] = api.profile.byUser.useSuspenseQuery();
  const [{ subscription }] =
    api.stripe.getActiveSubscriptionByUser.useSuspenseQuery();

  const { resolvedTheme } = useTheme();

  // Don't show for users with active subscription
  if (subscription?.status === 'active') {
    return null;
  }

  // Calculate usage percentages
  const usagePercentage = ((profile?.llmUsage || 0) / FREE_USAGE_LIMIT) * 100;
  // const premiumUsagePercentage =
  //   ((profile?.premiumLlmUsage || 0) / PREMIUM_USAGE_LIMIT) * 100;

  return (
    <Card className="shadow-none">
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center gap-2">
          <CardTitle className="font-medium text-muted-foreground text-xs">
            PLAN USAGE
          </CardTitle>
          <Badge
            variant={subscription ? 'default' : 'secondary'}
            className="flex-shrink-0 gap-1 rounded"
          >
            {subscription?.price?.product?.name?.split(' ').at(-1) || 'Free'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">Usage/day</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info
                    size={13}
                    strokeWidth={2}
                    className="text-muted-foreground opacity-60"
                  />
                </TooltipTrigger>
                <TooltipContent
                  showArrow={true}
                  side="right"
                  className={cn('', resolvedTheme === 'light' && 'dark')}
                >
                  <p className="text-sm">
                    Free daily usage limit for basic AI features
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground/60">
                {profile?.llmUsage || 0}
              </span>
              <span className="font-medium text-foreground/30">
                /{FREE_USAGE_LIMIT}
              </span>
            </div>
          </div>
          <Progress
            value={usagePercentage}
            className={cn(
              'h-2 [&>*]:bg-primary/10',
              profile?.llmUsage === FREE_USAGE_LIMIT && '[&>*]:bg-primary'
            )}
          />
        </div>

        {/* Premium usage stats temporarily removed
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-xs">Premium usage/day</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info
                    size={13}
                    strokeWidth={2}
                    className="text-muted-foreground opacity-60"
                  />
                </TooltipTrigger>
                <TooltipContent
                  showArrow={true}
                  side="right"
                  className={cn('', resolvedTheme === 'light' && 'dark')}
                >
                  <p className="text-sm">
                    Daily usage limit for premium AI features
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="text-sm">
              <span className="font-medium text-foreground/60">
                {profile?.premiumLlmUsage || 0}
              </span>
              <span className="font-medium text-foreground/30">
                /{PREMIUM_USAGE_LIMIT}
              </span>
            </div>
          </div>
          <Progress
            value={premiumUsagePercentage}
            className={cn(
              'h-2 [&>*]:bg-primary/10',
              profile?.premiumLlmUsage === PREMIUM_USAGE_LIMIT &&
                '[&>*]:bg-primary'
            )}
          />
        </div>
        */}

        <Button
          variant="secondary"
          size="sm"
          onMouseDown={() => openPricingDialog()}
          className="h-7 justify-start"
        >
          <Sparkles
            className="me-2 opacity-60"
            size={14}
            strokeWidth={2}
            aria-hidden="true"
          />
          Get unlimited
        </Button>
      </CardContent>
    </Card>
  );
}
