import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "../roles/roles.schema";
import { permissions } from "../permissions/permissions.schema";

/**
 * ROLE_PERMISSIONS TABLE (Linking table)
 *
 * RLS Policies:
 * - SELECT: (authenticated()) -- All authenticated users can read role mapping
 * - WRITE (INSERT/UPDATE/DELETE): (role = 'admin') -- Only admins can manage role permissions
 */
export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  })
);
