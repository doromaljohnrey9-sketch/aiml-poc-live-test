import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "../roles/roles.schema";
import { users } from "../auth/users.schema";

/**
 * USER_ROLES TABLE (Linking table)
 *
 * RLS Policies:
 * - SELECT: (authenticated() AND (auth.uid() = user_id OR role = 'admin')) -- Users can see their own roles, admins see all
 * - WRITE (INSERT/UPDATE/DELETE): (role = 'admin') -- Only admins can manage user roles
 */
export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);
