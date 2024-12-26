import { authUsers } from 'drizzle-orm/supabase';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { createTable } from './_table';

export const Customer = createTable('customer', (t) => ({
  id: t
    .uuid()
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  stripeCustomerId: t.text(),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Customer);
export const insertCustomerSchema = createInsertSchema(Customer);
export const updateCustomerSchema = baseSchema;

// Types for API
export type Customer = typeof Customer.$inferSelect;
export type NewCustomer = z.infer<typeof insertCustomerSchema>;
export type UpdateCustomer = z.infer<typeof updateCustomerSchema>;
