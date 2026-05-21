import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

import { PERMISSIONS, PermissionName } from "@/drizzle/constants/roles-permissions.constant";

export { PERMISSIONS, type PermissionName };

/**
 * PERMISSIONS TABLE
 *
 * RLS Policies:
 * - SELECT: (authenticated()) -- All authenticated users can read permissions
 * - WRITE (INSERT/UPDATE/DELETE): (role = 'admin') -- Only admins can modify permissions
 */
export const permissions = pgTable("permissions", {
  ...baseColumns,
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});
