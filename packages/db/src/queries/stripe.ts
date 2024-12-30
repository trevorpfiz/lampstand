import 'server-only';

import { and, eq } from 'drizzle-orm';
import type { Stripe } from 'stripe';

import { stripe } from '@lamp/payments';
import { db } from '../client';
import { Customer, type NewCustomer } from '../schema/customer';
import { type NewPrice, Price } from '../schema/price';
import { type NewProduct, Product } from '../schema/product';
import type { ProfileId } from '../schema/profile';
import { Profile } from '../schema/profile';
import { type NewSubscription, Subscription } from '../schema/subscription';

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Product operations
export const getProducts = async () => {
  const products = await db.query.Product.findMany({
    with: {
      prices: true,
    },
  });

  return products;
};

export async function upsertProduct(product: Stripe.Product) {
  const productData: NewProduct = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? '',
    image: product.images?.[0] ?? '',
    metadata: product.metadata,
  };

  const [upsertedProduct] = await db
    .insert(Product)
    .values(productData)
    .onConflictDoUpdate({
      target: [Product.id],
      set: productData,
    })
    .returning();

  return { product: upsertedProduct };
}

export async function deleteProduct(productId: string) {
  const [deletedProduct] = await db
    .delete(Product)
    .where(eq(Product.id, productId))
    .returning();

  return { product: deletedProduct };
}

// Price operations
export async function upsertPrice(price: Stripe.Price) {
  const priceData: NewPrice = {
    id: price.id,
    productId: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    description: price.nickname ?? '',
    unitAmount: price.unit_amount ?? 0,
    currency: price.currency,
    type: price.type === 'recurring' ? 'recurring' : 'one_time',
    interval: price.recurring?.interval ?? 'month',
    intervalCount: price.recurring?.interval_count ?? 1,
    trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    metadata: price.metadata,
  };

  const [upsertedPrice] = await db
    .insert(Price)
    .values(priceData)
    .onConflictDoUpdate({
      target: [Price.id],
      set: priceData,
    })
    .returning();

  return { price: upsertedPrice };
}

export async function deletePrice(priceId: string) {
  const [deletedPrice] = await db
    .delete(Price)
    .where(eq(Price.id, priceId))
    .returning();

  return { price: deletedPrice };
}

// Customer operations
export async function upsertCustomer({
  userId,
  stripeCustomerId,
}: {
  userId: ProfileId;
  stripeCustomerId: string;
}) {
  const customerData: NewCustomer = {
    id: userId,
    stripeCustomerId,
  };

  const [customer] = await db
    .insert(Customer)
    .values(customerData)
    .onConflictDoUpdate({
      target: [Customer.id],
      set: customerData,
    })
    .returning();

  return { customer };
}

export async function getCustomerByUserId(userId: ProfileId) {
  const customer = await db.query.Customer.findFirst({
    where: eq(Customer.id, userId),
  });

  return { customer };
}

// Subscription operations
export async function upsertSubscription(
  subscription: Stripe.Subscription,
  userId: ProfileId
) {
  if (!subscription.items.data[0]?.price?.id) {
    throw new Error('Missing price information in subscription');
  }

  const subscriptionData: NewSubscription = {
    id: subscription.id,
    userId,
    status: subscription.status,
    metadata: subscription.metadata,
    priceId: subscription.items.data[0].price.id,
    quantity: subscription.items.data[0].quantity ?? 1,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    created: new Date(subscription.created * 1000),
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    endedAt: subscription.ended_at
      ? new Date(subscription.ended_at * 1000)
      : null,
    cancelAt: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null,
    canceledAt: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000)
      : null,
    trialStart: subscription.trial_start
      ? new Date(subscription.trial_start * 1000)
      : null,
    trialEnd: subscription.trial_end
      ? new Date(subscription.trial_end * 1000)
      : null,
  };

  const [upsertedSubscription] = await db
    .insert(Subscription)
    .values(subscriptionData)
    .onConflictDoUpdate({
      target: [Subscription.id],
      set: subscriptionData,
    })
    .returning();

  return { subscription: upsertedSubscription };
}

export async function getSubscriptionsByUserId(userId: ProfileId) {
  const subscriptions = await db.query.Subscription.findMany({
    where: eq(Subscription.userId, userId),
    with: {
      price: {
        with: {
          product: true,
        },
      },
    },
  });

  return { subscriptions };
}

export async function getActiveSubscriptionByUserId(userId: ProfileId) {
  const subscription = await db.query.Subscription.findFirst({
    where: and(
      eq(Subscription.userId, userId),
      eq(Subscription.status, 'active')
    ),
    with: {
      price: {
        with: {
          product: true,
        },
      },
    },
  });

  return { subscription };
}

// Customer operations
export async function createCustomerInStripe({
  userId,
  email,
}: {
  userId: string;
  email: string;
}) {
  const customerData = {
    metadata: { userId },
    email: email,
  };

  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) {
    throw new Error('Stripe customer creation failed.');
  }

  return newCustomer;
}

export async function createOrRetrieveCustomer({
  email,
  userId,
}: {
  email: string;
  userId: ProfileId;
}) {
  // Check if the customer already exists in our database
  const { customer: existingCustomer } = await getCustomerByUserId(userId);

  // If we have a customer with a Stripe ID, verify it exists in Stripe
  let stripeCustomerId: string | undefined;
  if (existingCustomer?.stripeCustomerId) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingCustomer.stripeCustomerId
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If no Stripe ID in our DB, try to find customer in Stripe by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId = stripeCustomers.data[0]?.id;
  }

  // If no Stripe customer found, create one
  if (!stripeCustomerId) {
    const newCustomer = await createCustomerInStripe({ userId, email });
    stripeCustomerId = newCustomer.id;
  }

  if (!stripeCustomerId) {
    throw new Error('Failed to create or retrieve Stripe customer');
  }

  // Ensure our database is in sync with Stripe
  const { customer } = await upsertCustomer({
    userId,
    stripeCustomerId,
  });

  return { customer, stripeCustomerId };
}

export async function copyBillingDetailsToCustomer({
  userId,
  paymentMethod,
}: {
  userId: ProfileId;
  paymentMethod: Stripe.PaymentMethod;
}) {
  const { name, phone, address } = paymentMethod.billing_details;
  if (!name || !phone || !address) {
    return;
  }

  // Update customer in Stripe
  await stripe.customers.update(paymentMethod.customer as string, {
    name,
    phone,
    address: {
      city: address.city ?? undefined,
      country: address.country ?? undefined,
      line1: address.line1 ?? undefined,
      line2: address.line2 ?? undefined,
      postal_code: address.postal_code ?? undefined,
      state: address.state ?? undefined,
    },
  });

  // Update profile in our database
  const [updatedProfile] = await db
    .update(Profile)
    .set({
      billingAddress: address,
      paymentMethod: paymentMethod[paymentMethod.type],
    })
    .where(eq(Profile.id, userId))
    .returning();

  return { profile: updatedProfile };
}

export async function manageSubscriptionStatusChange({
  subscriptionId,
  customerId,
  isNewSubscription = false,
}: {
  subscriptionId: string;
  customerId: string;
  isNewSubscription?: boolean;
}) {
  // Get customer from our database
  const { customer } = await getCustomerByStripeId(customerId);
  if (!customer) {
    throw new Error(`Customer not found for Stripe ID: ${customerId}`);
  }

  // Get subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  });

  // Update subscription in our database
  const { subscription: updatedSubscription } = await upsertSubscription(
    subscription,
    customer.id
  );

  // For new subscriptions, copy billing details
  if (isNewSubscription && subscription.default_payment_method && customer.id) {
    await copyBillingDetailsToCustomer({
      userId: customer.id,
      paymentMethod:
        subscription.default_payment_method as Stripe.PaymentMethod,
    });
  }

  return { subscription: updatedSubscription };
}

// Helper function to get customer by Stripe ID
export async function getCustomerByStripeId(stripeCustomerId: string) {
  const customer = await db.query.Customer.findFirst({
    where: eq(Customer.stripeCustomerId, stripeCustomerId),
  });

  return { customer };
}
