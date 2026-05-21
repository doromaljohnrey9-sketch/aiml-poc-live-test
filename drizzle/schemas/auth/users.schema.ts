import { pgSchema, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Supabase Auth Schema
 * This schema and table are managed by Supabase and exist in the 'auth' schema.
 */
export const authSchema = pgSchema("auth");

export const users = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
  email: text("email"),
  createdAt: timestamp("created_at"),
});
