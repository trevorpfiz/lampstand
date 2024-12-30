import { analytics } from '@lamp/analytics/posthog/server';
import {
  deletePrice,
  deleteProduct,
  manageSubscriptionStatusChange,
  upsertPrice,
  upsertProduct,
} from '@lamp/db/queries';
import { env } from '@lamp/env';
import { logger } from '@lamp/logger';
import { parseError } from '@lamp/observability/error';
import { stripe } from '@lamp/payments';
import type { Stripe } from 'stripe';

import {
  handleCheckoutSessionCompleted,
  handleSubscriptionScheduleCanceled,
  handleSubscriptionUpdated,
} from './utils';

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'subscription_schedule.canceled',
]);

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
export const POST = async (req: Request): Promise<Response> => {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature') as string;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      return new Response('Webhook secret not found.', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    logger.info(`🔔 Webhook received: ${event.type}`);
  } catch (error) {
    const message = parseError(error);

    return new Response(`Webhook Error: ${message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(event.data.object as Stripe.Product);
          break;
        case 'product.deleted':
          await deleteProduct((event.data.object as Stripe.Product).id);
          break;

        case 'price.created':
        case 'price.updated':
          await upsertPrice(event.data.object as Stripe.Price);
          break;
        case 'price.deleted':
          await deletePrice((event.data.object as Stripe.Price).id);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          await manageSubscriptionStatusChange({
            subscriptionId: subscription.id,
            customerId: subscription.customer as string,
            isNewSubscription: event.type === 'customer.subscription.created',
          });

          if (event.type === 'customer.subscription.updated') {
            await handleSubscriptionUpdated(subscription);
          }
          break;
        }

        case 'checkout.session.completed': {
          const checkoutSession = event.data.object as Stripe.Checkout.Session;
          await handleCheckoutSessionCompleted(checkoutSession);

          if (
            checkoutSession.mode === 'subscription' &&
            checkoutSession.subscription
          ) {
            await manageSubscriptionStatusChange({
              subscriptionId: checkoutSession.subscription as string,
              customerId: checkoutSession.customer as string,
              isNewSubscription: true,
            });
          }
          break;
        }

        case 'subscription_schedule.canceled': {
          await handleSubscriptionScheduleCanceled(
            event.data.object as Stripe.SubscriptionSchedule
          );
          break;
        }

        default: {
          logger.warn(`Unhandled relevant event: ${event.type}`);
          throw new Error('Unhandled relevant event!');
        }
      }

      // Track successful webhook handling
      analytics.capture({
        distinctId: 'stripe_webhook',
        event: 'stripe_webhook_processed',
        properties: {
          event_type: event.type,
          event_id: event.id,
        },
      });
    } catch (error) {
      const message = parseError(error);

      return new Response(
        `Webhook handler failed. View your Next.js function logs. ${message}`,
        { status: 400 }
      );
    }
  } else {
    logger.warn(`Unsupported event type: ${event.type}`);
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400,
    });
  }

  await analytics.shutdown();

  return new Response(JSON.stringify({ received: true }));
};
