export type BillingInterval = 'year' | 'month' | 'week' | 'day';

export interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  buttonText: string;
  order: number;
  features: Array<{
    name: string;
    tooltip?: string;
  }>;
  popular?: boolean;
  isCurrentPlan?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: resolve cyclic dependency to use Price type
  currentPrice?: any;
  isFree?: boolean;
  isIncluded?: boolean;
}

export const mockPlans: PricingPlan[] = [
  {
    name: 'Free',
    description: 'Great for those just getting started with Bible study',
    monthlyPrice: 0,
    yearlyPrice: 0,
    buttonText: 'Start for Free',
    order: 1,
    features: [
      {
        name: '15 AI text generations / day',
      },
      {
        name: '5 premium AI text generations / day',
        tooltip: 'GPT-4o is counted as a premium model.',
      },
      {
        name: 'Unlimited notes',
      },
    ],
  },
  {
    name: 'Pro',
    description: 'Perfect for small group leaders and in-depth study',
    monthlyPrice: 10,
    yearlyPrice: 96,
    buttonText: 'Get Started',
    order: 2,
    popular: true,
    features: [
      {
        name: 'Unlimited AI text generations',
      },
      {
        name: 'Unlimited premium AI text generations',
        tooltip: 'GPT-4o is counted as a premium model.',
      },
      {
        name: 'Priority customer support',
      },
    ],
  },
];
