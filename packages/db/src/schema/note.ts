import { relations, sql } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { timestamps } from '../lib/utils';
import { createTable } from './_table';
import { Profile } from './profile';
import { Study } from './study';

export const Note = createTable(
  'note',
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id, { onDelete: 'cascade' }),
    studyId: t.uuid().references(() => Study.id, { onDelete: 'set null' }),
    title: t.varchar({ length: 256 }).notNull().default(''),
    content: t.jsonb().notNull().default(sql`'[]'::jsonb`), // Storing the Slate/Markdown content here

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: 'date', withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    // For byStudyId queries
    index('note_study_profile_created_idx').on(
      table.studyId,
      table.profileId,
      table.createdAt.desc()
    ),
    // For byUserId queries
    index('note_profile_created_idx').on(
      table.profileId,
      table.createdAt.desc()
    ),
    // For ownership verification
    index('note_id_profile_idx').on(table.id, table.profileId),
  ]
);

export const NoteRelations = relations(Note, ({ one }) => ({
  profile: one(Profile, {
    fields: [Note.profileId],
    references: [Profile.id],
  }),
  study: one(Study, {
    fields: [Note.studyId],
    references: [Study.id],
  }),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Note);

export const insertNoteSchema = createInsertSchema(Note).omit(timestamps);
export const insertNoteParams = insertNoteSchema.omit({
  id: true,
  profileId: true,
});

export const updateNoteSchema = baseSchema;
export const updateNoteParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
    studyId: true,
  })
  .partial()
  .extend({ id: baseSchema.shape.id });
export const noteIdSchema = baseSchema.pick({ id: true });
export const minimalNoteSchema = baseSchema.pick({
  id: true,
  title: true,
  createdAt: true,
  updatedAt: true,
});

// Types for API
export type Note = typeof Note.$inferSelect;
export type NewNote = z.infer<typeof insertNoteSchema>;
export type NewNoteParams = z.infer<typeof insertNoteParams>;
export type UpdateNoteParams = z.infer<typeof updateNoteParams>;
export type NoteId = z.infer<typeof noteIdSchema>['id'];
export type MinimalNote = z.infer<typeof minimalNoteSchema>;
