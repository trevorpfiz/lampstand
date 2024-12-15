import type { CoreMessage } from "ai";
import type { z } from "zod";
import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { timestamps } from "../lib/utils";
import { createTable } from "./_table";
import { Chat } from "./chat";

export const Message = createTable(
  "message",
  (t) => ({
    id: t.uuid().defaultRandom().primaryKey(),
    chatId: t
      .uuid()
      .notNull()
      .references(() => Chat.id, { onDelete: "cascade" }),
    role: t.varchar({ length: 256 }).notNull(),
    content: t
      .jsonb()
      .$type<CoreMessage>()
      .notNull()
      .default(sql`'{}'::jsonb`),

    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({
        mode: "date",
        withTimezone: true,
      })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index("message_chat_id_idx").on(table.chatId),
    index("message_created_at_idx").on(table.createdAt),
  ],
);

export const MessageRelations = relations(Message, ({ one }) => ({
  chat: one(Chat, {
    fields: [Message.chatId],
    references: [Chat.id],
  }),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Message);

export const insertMessageSchema = createInsertSchema(Message).omit(timestamps);
export const insertMessageParams = insertMessageSchema.omit({
  id: true,
});

export const updateMessageSchema = baseSchema;
export const updateMessageParams = baseSchema.extend({}).partial().extend({
  id: baseSchema.shape.id,
});
export const messageIdSchema = baseSchema.pick({ id: true });

// Types for API
export type Message = typeof Message.$inferSelect;
export type NewMessage = z.infer<typeof insertMessageSchema>;
export type NewMessageParams = z.infer<typeof insertMessageParams>;
export type UpdateMessageParams = z.infer<typeof updateMessageParams>;
export type MessageId = z.infer<typeof messageIdSchema>["id"];
