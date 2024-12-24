import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { timestamps } from '../lib/utils';
import { createTable } from './_table';
import { Chat } from './chat';
import { Note } from './note';
import { Profile } from './profile';

export const Study = createTable(
  'study',
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id, { onDelete: 'cascade' }),
    title: t.varchar({ length: 256 }).notNull(),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index('study_profile_id_idx').on(table.profileId),
    index('study_created_at_idx').on(table.createdAt),
  ]
);

export const StudyRelations = relations(Study, ({ one, many }) => ({
  profile: one(Profile, {
    fields: [Study.profileId],
    references: [Profile.id],
  }),
  chats: many(Chat),
  notes: many(Note),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Study);

export const insertStudySchema = createInsertSchema(Study).omit(timestamps);
export const insertStudyParams = insertStudySchema.omit({
  id: true,
  profileId: true,
});

export const updateStudySchema = baseSchema;
export const updateStudyParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const studyIdSchema = baseSchema.pick({ id: true });

// Types for API
export type Study = typeof Study.$inferSelect;
export type NewStudy = z.infer<typeof insertStudySchema>;
export type NewStudyParams = z.infer<typeof insertStudyParams>;
export type UpdateStudyParams = z.infer<typeof updateStudyParams>;
export type StudyId = z.infer<typeof studyIdSchema>['id'];
