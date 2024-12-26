import { analytics } from '@lamp/analytics/posthog/server';
import { getCustomerByStripeId } from '@lamp/db/queries';
import type { Stripe } from 'stripe';

/**
 * Get user ID from Stripe customer ID using our database mapping
 */
export async function getUserIdFromStripeCustomer(customerId: string) {
  const { customer } = await getCustomerByStripeId(customerId);
  if (!customer) {
    return null;
  }
  return customer.id;
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (!session.customer) {
    return;
  }

  const customerId =
    typeof session.customer === 'string'
      ? session.customer
      : session.customer.id;
  const userId = await getUserIdFromStripeCustomer(customerId);

  if (!userId) {
    return;
  }

  analytics.capture({
    event: 'User Subscribed',
    distinctId: userId,
    properties: {
      session_id: session.id,
      customer_id: customerId,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
    },
  });
}

export async function handleSubscriptionScheduleCanceled(
  schedule: Stripe.SubscriptionSchedule
) {
  if (!schedule.customer) {
    return;
  }

  const customerId =
    typeof schedule.customer === 'string'
      ? schedule.customer
      : schedule.customer.id;
  const userId = await getUserIdFromStripeCustomer(customerId);

  if (!userId) {
    return;
  }

  analytics.capture({
    event: 'User Unsubscribed',
    distinctId: userId,
    properties: {
      schedule_id: schedule.id,
      customer_id: customerId,
      status: schedule.status,
    },
  });
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  if (!subscription.customer) {
    return;
  }

  const customerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id;
  const userId = await getUserIdFromStripeCustomer(customerId);

  if (!userId) {
    return;
  }

  analytics.capture({
    event: 'Subscription Updated',
    distinctId: userId,
    properties: {
      subscription_id: subscription.id,
      customer_id: customerId,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000),
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
  });
}
