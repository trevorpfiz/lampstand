import { relations } from 'drizzle-orm';
import { index, pgEnum } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import type { InferQueryModel } from '../lib/utils';
import { createTable } from './_table';
import { Price } from './price';

export const subscriptionStatus = [
  'trialing',
  'active',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'unpaid',
  'paused',
] as const;
export const subscriptionStatusEnum = pgEnum(
  'subscription_status',
  subscriptionStatus
);

export const Subscription = createTable(
  'subscription',
  (t) => ({
    id: t.text().primaryKey(), // Subscription ID from Stripe
    userId: t.uuid().references(() => authUsers.id),
    status: subscriptionStatusEnum(),
    metadata: t.jsonb(),
    priceId: t.text().references(() => Price.id),
    quantity: t.integer(),
    cancelAtPeriodEnd: t.boolean(),
    created: t.timestamp({ withTimezone: true }).defaultNow(),
    currentPeriodStart: t.timestamp({ withTimezone: true }).defaultNow(),
    currentPeriodEnd: t.timestamp({ withTimezone: true }).defaultNow(),
    endedAt: t.timestamp({ withTimezone: true }).defaultNow(),
    cancelAt: t.timestamp({ withTimezone: true }).defaultNow(),
    canceledAt: t.timestamp({ withTimezone: true }).defaultNow(),
    trialStart: t.timestamp({ withTimezone: true }).defaultNow(),
    trialEnd: t.timestamp({ withTimezone: true }).defaultNow(),
  }),
  (table) => [
    // For active subscription lookup by user
    index('subscription_user_status_idx').on(table.userId, table.status),
    // For subscription management
    index('subscription_user_period_idx').on(
      table.userId,
      table.currentPeriodEnd
    ),
  ]
);

export const SubscriptionRelations = relations(Subscription, ({ one }) => ({
  price: one(Price, {
    fields: [Subscription.priceId],
    references: [Price.id],
  }),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Subscription);
export const insertSubscriptionSchema = createInsertSchema(Subscription);
export const updateSubscriptionSchema = baseSchema;

// Types for API
export type Subscription = typeof Subscription.$inferSelect;
export type NewSubscription = z.infer<typeof insertSubscriptionSchema>;
export type UpdateSubscription = z.infer<typeof updateSubscriptionSchema>;
export type SubscriptionWithDetails = InferQueryModel<
  'Subscription',
  {
    with: {
      price: {
        with: {
          product: true;
        };
      };
    };
  }
>;
