import { pgTable, varchar, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

import { PERMISSIONS, PermissionName } from "@/drizzle/constants/roles-permissions.constant";

export { PERMISSIONS, type PermissionName };

export const permissions = pgTable("permissions", {
  ...baseColumns,
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
});
