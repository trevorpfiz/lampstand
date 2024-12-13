import type { CoreMessage } from "ai";
import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Profile } from "./profile";
import { Study } from "./study";

export const Chat = createTable(
  "chat",
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    profileId: t
      .uuid()
      .notNull()
      .references(() => Profile.id, { onDelete: "cascade" }),
    studyId: t
      .uuid()
      .notNull()
      .references(() => Study.id, { onDelete: "cascade" }),
    messages: t
      .jsonb()
      .array()
      .$type<CoreMessage[]>()
      .notNull()
      .default(sql`'{}'::jsonb[]`),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({
        mode: "date",
        withTimezone: true,
      })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index("chat_profile_id_idx").on(table.profileId),
    index("chat_study_id_idx").on(table.studyId),
    index("chat_created_at_idx").on(table.createdAt),
  ],
);

export const ChatRelations = relations(Chat, ({ one }) => ({
  profile: one(Profile, {
    fields: [Chat.profileId],
    references: [Profile.id],
  }),
  study: one(Study, {
    fields: [Chat.studyId],
    references: [Study.id],
  }),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Chat);

export const insertChatSchema = createInsertSchema(Chat).omit(timestamps);
export const insertChatParams = insertChatSchema.omit({
  id: true,
  profileId: true,
  studyId: true,
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

// Types for API
export type Chat = typeof Chat.$inferSelect;
export type NewChat = z.infer<typeof insertChatSchema>;
export type NewChatParams = z.infer<typeof insertChatParams>;
export type UpdateChatParams = z.infer<typeof updateChatParams>;
export type ChatId = z.infer<typeof chatIdSchema>["id"];
