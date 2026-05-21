import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

import { ROLES, RoleName } from "@/drizzle/constants/roles-permissions.constant";

export { ROLES, type RoleName };

export const roles = pgTable("roles", {
  ...baseColumns,
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
});
