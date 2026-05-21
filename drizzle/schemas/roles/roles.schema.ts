import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

import { ROLES, RoleName } from "@/drizzle/constants/roles-permissions.constant";

export { ROLES, type RoleName };

/**
 * ROLES TABLE
 *
 * RLS Policies:
 * - SELECT: (authenticated()) -- All authenticated users can read roles
 * - WRITE (INSERT/UPDATE/DELETE): (role = 'admin') -- Only admins can modify roles
 */
export const roles = pgTable("roles", {
  ...baseColumns,
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
});
