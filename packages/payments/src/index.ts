import 'server-only';

import Stripe from 'stripe';

import { env } from '@lamp/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export type { Stripe } from 'stripe';
