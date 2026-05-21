import * as schema from "@/drizzle/schemas";

export type SelectProfile = typeof schema.profiles.$inferSelect & {
  role?: string | null;
};
export type InsertProfile = typeof schema.profiles.$inferInsert;
