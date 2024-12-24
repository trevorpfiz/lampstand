import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { timestamps } from '../lib/utils';
import { createTable } from './_table';
import { Profile } from './profile';

export const Feedback = createTable(
  'feedback',
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id, { onDelete: 'cascade' }),
    content: t.text().notNull(),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index('feedback_profile_id_idx').on(table.profileId),
    index('feedback_created_at_idx').on(table.createdAt),
  ]
);

export const FeedbackRelations = relations(Feedback, ({ one }) => ({
  profile: one(Profile, {
    fields: [Feedback.profileId],
    references: [Profile.id],
  }),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Feedback);

export const insertFeedbackSchema =
  createInsertSchema(Feedback).omit(timestamps);
export const insertFeedbackParams = insertFeedbackSchema.omit({
  id: true,
  profileId: true,
});

export const updateFeedbackSchema = baseSchema;
export const updateFeedbackParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const feedbackIdSchema = baseSchema.pick({ id: true });

// Types for API
export type Feedback = typeof Feedback.$inferSelect;
export type NewFeedback = z.infer<typeof insertFeedbackSchema>;
export type NewFeedbackParams = z.infer<typeof insertFeedbackParams>;
export type UpdateFeedbackParams = z.infer<typeof updateFeedbackParams>;
export type FeedbackId = z.infer<typeof feedbackIdSchema>['id'];
