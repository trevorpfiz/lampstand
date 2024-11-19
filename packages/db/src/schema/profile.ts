import { index, uniqueIndex } from "drizzle-orm/pg-core";

import { createTable } from "./_table";
import { Users } from "./auth";

export const Profile = createTable(
  "profile",
  (t) => ({
    // Matches id from auth.users table in Supabase
    id: t
      .uuid()
      .primaryKey()
      .references(() => Users.id, { onDelete: "cascade" }),
    name: t.varchar({ length: 256 }).notNull(),
    image: t.varchar({ length: 256 }),
    email: t.varchar({ length: 256 }),
  }),
  (table) => [
    index("name_idx").on(table.name),
    uniqueIndex("email_idx").on(table.email),
  ],
);

// export const ProfileRelations = relations(Profile, ({ many }) => ({
//   jobs: many(Job),
// }));
