import 'server-only';

import type { Stripe } from 'stripe';

import { createOrRetrieveCustomer } from '@lamp/db/queries';
import type { Price, ProfileId } from '@lamp/db/schema';
import { stripe } from './index';
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getURL,
} from './utils';

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe({
  price,
  userId,
  email,
  redirectPath = '/account',
}: {
  price: Price;
  userId: ProfileId;
  email: string;
  redirectPath?: string;
}): Promise<CheckoutResponse> {
  try {
    // Retrieve or create the customer in Stripe
    const { stripeCustomerId } = await createOrRetrieveCustomer({
      userId,
      email,
    });

    if (!stripeCustomerId) {
      throw new Error('Could not get customer.');
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer: stripeCustomerId,
      customer_update: {
        address: 'auto',
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getURL(),
      success_url: getURL(redirectPath),
    };

    if (price.type === 'recurring') {
      params = {
        ...params,
        mode: 'subscription',
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trialPeriodDays),
        },
      };
    } else if (price.type === 'one_time') {
      params = {
        ...params,
        mode: 'payment',
      };
    }

    // Create a checkout session in Stripe
    const session = await stripe.checkout.sessions.create(params);

    if (!session?.id) {
      throw new Error('Unable to create checkout session.');
    }

    return { sessionId: session.id };
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact a system administrator.'
        ),
      };
    }
    return {
      errorRedirect: getErrorRedirect(
        redirectPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      ),
    };
  }
}

export async function createStripePortal({
  userId,
  email,
  returnPath = '/account',
}: {
  userId: ProfileId;
  email: string;
  returnPath?: string;
}): Promise<string> {
  try {
    const { stripeCustomerId } = await createOrRetrieveCustomer({
      userId,
      email,
    });

    if (!stripeCustomerId) {
      throw new Error('Could not get customer.');
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: getURL(returnPath),
    });

    if (!url) {
      throw new Error('Could not create billing portal');
    }

    return url;
  } catch (error) {
    if (error instanceof Error) {
      return getErrorRedirect(
        returnPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    }
    return getErrorRedirect(
      returnPath,
      'An unknown error occurred.',
      'Please try again later or contact a system administrator.'
    );
  }
}
