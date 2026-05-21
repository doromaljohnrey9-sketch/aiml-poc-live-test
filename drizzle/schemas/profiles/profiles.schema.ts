import { pgTable, varchar, uuid, timestamp } from "drizzle-orm/pg-core";
import { users as authUsers } from "../auth/users.schema";

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
});
