import { relations } from 'drizzle-orm';
import { index } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

import { timestamps } from '../lib/utils';
import { createTable } from './_table';
import { Message } from './message';
import { Profile } from './profile';
import { Study } from './study';

export const Chat = createTable(
  'chat',
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id, { onDelete: 'cascade' }),
    studyId: t
      .uuid()
      .notNull()
      .references(() => Study.id, { onDelete: 'cascade' }),
    title: t.varchar({ length: 256 }).notNull().default('New Chat'),
    visibility: t
      .varchar({ enum: ['public', 'private'] })
      .notNull()
      .default('private'),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({
        mode: 'date',
        withTimezone: true,
      })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index('chat_id_profile_idx').on(table.id, table.profileId),
    index('chat_study_profile_created_idx').on(
      table.studyId,
      table.profileId,
      table.createdAt.desc()
    ),
    index('chat_profile_created_idx').on(
      table.profileId,
      table.createdAt.desc()
    ),
  ]
);

export const ChatRelations = relations(Chat, ({ one, many }) => ({
  profile: one(Profile, {
    fields: [Chat.profileId],
    references: [Profile.id],
  }),
  study: one(Study, {
    fields: [Chat.studyId],
    references: [Study.id],
  }),
  messages: many(Message),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Chat);

export const insertChatSchema = createInsertSchema(Chat).omit(timestamps);
export const insertChatParams = insertChatSchema.omit({
  id: true,
  profileId: true,
});

export const updateChatSchema = baseSchema;
export const updateChatParams = baseSchema
  .extend({})
  .omit({
    profileId: true,
    studyId: true,
  })
  .partial()
  .extend({
    id: baseSchema.shape.id,
  });
export const chatIdSchema = baseSchema.pick({ id: true });
export const chatVisibilitySchema = baseSchema.pick({ visibility: true });

// Types for API
export type Chat = typeof Chat.$inferSelect;
export type NewChat = z.infer<typeof insertChatSchema>;
export type NewChatParams = z.infer<typeof insertChatParams>;
export type UpdateChatParams = z.infer<typeof updateChatParams>;
export type ChatId = z.infer<typeof chatIdSchema>['id'];
export type ChatVisibility = z.infer<typeof chatVisibilitySchema>['visibility'];
