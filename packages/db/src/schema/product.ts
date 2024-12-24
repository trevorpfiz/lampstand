import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { createTable } from './_table';
import { Price } from './price';

export const Product = createTable('product', (t) => ({
  id: t.text().primaryKey(), // Product ID from Stripe
  active: t.boolean(),
  name: t.text(),
  description: t.text(),
  image: t.text(),
  metadata: t.jsonb(),
}));

export const ProductRelations = relations(Product, ({ many }) => ({
  prices: many(Price),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Product);
export const insertProductSchema = createInsertSchema(Product);
export const updateProductSchema = baseSchema;

// Types for API
export type Product = typeof Product.$inferSelect;
export type NewProduct = z.infer<typeof insertProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
