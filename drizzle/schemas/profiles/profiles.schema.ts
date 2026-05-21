import { pgTable, varchar, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { users as authUsers } from "../auth/users.schema";

/**
 * PROFILES TABLE
 *
 * RLS Policies:
 * - SELECT: (authenticated() AND (auth.uid() = id)) -- Users can see their own profile
 * - UPDATE: (authenticated() AND (auth.uid() = id)) -- Users can update their own profile
 * - DELETE: (role = 'admin') -- Only admins can delete profiles
 * - INSERT: (role = 'admin' OR trigger) -- Admins or system trigger during signup
 */
export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp("deleted_at"),
  name: varchar("name", { length: 100 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  isActive: boolean("is_active").default(true),
});
