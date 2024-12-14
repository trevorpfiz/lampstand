import type { z } from "zod";
import { relations } from "drizzle-orm";
import { index, uniqueIndex } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { createTable } from "./_table";
import { Chat } from "./chat";
import { Feedback } from "./feedback";
import { Note } from "./note";
import { Study } from "./study";

export const Profile = createTable(
  "profile",
  (t) => ({
    // Matches id from auth.users table in Supabase
    id: t
      .uuid()
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    name: t.varchar({ length: 256 }).notNull(),
    image: t.varchar({ length: 256 }),
    email: t.varchar({ length: 256 }),
  }),
  (table) => [
    index("profile_name_idx").on(table.name),
    uniqueIndex("profile_email_idx").on(table.email),
  ],
);

export const ProfileRelations = relations(Profile, ({ many }) => ({
  studies: many(Study),
  chats: many(Chat),
  notes: many(Note),
  feedback: many(Feedback),
}));

// Schemas for validation
const baseSchema = createSelectSchema(Profile);

export const insertProfileSchema = createInsertSchema(Profile);
export const insertProfileParams = insertProfileSchema.omit({ id: true });

export const updateProfileSchema = baseSchema;
export const updateProfileParams = baseSchema.extend({}).partial().extend({
  id: baseSchema.shape.id,
});
export const profileIdSchema = baseSchema.pick({ id: true });

// Types for API
export type Profile = typeof Profile.$inferSelect;
export type NewProfile = z.infer<typeof insertProfileSchema>;
export type NewProfileParams = z.infer<typeof insertProfileParams>;
export type UpdateProfileParams = z.infer<typeof updateProfileParams>;
export type ProfileId = z.infer<typeof profileIdSchema>["id"];
