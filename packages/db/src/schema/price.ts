import { relations, sql } from 'drizzle-orm';
import { check, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { createTable } from './_table';
import { Product } from './product';
import { Subscription } from './subscription';

// Enums for pricing type and interval
export const pricingType = ['one_time', 'recurring'] as const;
export const pricingTypeEnum = pgEnum('pricing_type', pricingType);
export const pricingPlanInterval = ['day', 'week', 'month', 'year'] as const;
export const pricingPlanIntervalEnum = pgEnum(
  'pricing_plan_interval',
  pricingPlanInterval
);

export const Price = createTable(
  'price',
  (t) => ({
    id: t.text().primaryKey(), // Price ID from Stripe
    productId: t.text().references(() => Product.id),
    active: t.boolean(),
    description: t.text(),
    unitAmount: t.bigint({ mode: 'number' }),
    currency: t.text(),
    type: pricingTypeEnum(),
    interval: pricingPlanIntervalEnum(),
    intervalCount: t.integer(),
    trialPeriodDays: t.integer(),
    metadata: t.jsonb(),
  }),
  (table) => [
    {
      checkConstraint: check(
        'currency_length_check',
        sql`char_length(${table.currency}) = 3`
      ),
    },
  ]
);

export const PriceRelations = relations(Price, ({ one, many }) => ({
  product: one(Product, {
    fields: [Price.productId],
    references: [Product.id],
  }),
  subscriptions: many(Subscription),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Price);
export const insertPriceSchema = createInsertSchema(Price);
export const updatePriceSchema = baseSchema;

// Types for API
export type Price = typeof Price.$inferSelect;
export type NewPrice = z.infer<typeof insertPriceSchema>;
export type UpdatePrice = z.infer<typeof updatePriceSchema>;
