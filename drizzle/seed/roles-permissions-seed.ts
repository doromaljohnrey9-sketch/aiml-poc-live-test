import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import { roles } from "../schemas/roles/roles.schema";
import { permissions } from "../schemas/permissions/permissions.schema";
import { ROLES, PERMISSIONS } from "../constants/roles-permissions.constant";
import { rolePermissions } from "../schemas/role-permissions/role-permissions.schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(process.env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("🌱 Seeding roles and permissions...");

  // 1. Seed Permissions
  const permissionEntries = Object.values(PERMISSIONS).map((name) => ({
    name,
    description: `Permission to ${name.replace(":", " ")}`,
  }));

  for (const entry of permissionEntries) {
    await db
      .insert(permissions)
      .values(entry)
      .onConflictDoUpdate({
        target: permissions.name,
        set: { description: entry.description },
      });
  }
  console.log("✅ Permissions seeded");

  // 2. Seed Roles
  const roleEntries = Object.values(ROLES).map((name) => ({
    name,
    description: `${name.charAt(0).toUpperCase() + name.slice(1)} role`,
  }));

  for (const entry of roleEntries) {
    await db
      .insert(roles)
      .values(entry)
      .onConflictDoUpdate({
        target: roles.name,
        set: { description: entry.description },
      });
  }
  console.log("✅ Roles seeded");

  // 3. Helper to get IDs
  const allPermissions = await db.select().from(permissions);
  const allRoles = await db.select().from(roles);

  const getPermissionId = (name: string) => allPermissions.find((p) => p.name === name)!.id;
  const getRoleId = (name: string) => allRoles.find((r) => r.name === name)!.id;

  // 4. Role-Permission Mapping
  const rolePermissionMapping: Record<string, string[]> = {
    [ROLES.ADMIN]: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_CONTENT_SOURCE_LIST,
      PERMISSIONS.VIEW_GENERATED_CONTENT,
      PERMISSIONS.APPROVE_REJECT_CONTENT,
      PERMISSIONS.VIEW_DISTRIBUTION_LOGS,
      PERMISSIONS.MANAGE_BANNED_PHRASES,
      PERMISSIONS.MANAGE_USERS_ROLES,
      PERMISSIONS.CONFIGURE_WEEKLY_LOOP,
      PERMISSIONS.EMERGENCY_STOP,
      PERMISSIONS.VIEW_SYSTEM_SETTINGS,
    ],
    [ROLES.OPERATOR]: [
      PERMISSIONS.VIEW_DASHBOARD,
      PERMISSIONS.VIEW_CONTENT_SOURCE_LIST,
      PERMISSIONS.TRIGGER_AI_GENERATION,
      PERMISSIONS.VIEW_GENERATED_CONTENT,
      PERMISSIONS.APPROVE_REJECT_CONTENT,
      PERMISSIONS.EXECUTE_DISTRIBUTION,
      PERMISSIONS.VIEW_DISTRIBUTION_LOGS,
    ],
    [ROLES.CONTRIBUTOR]: [PERMISSIONS.SUBMIT_CONTENT_SOURCE, PERMISSIONS.VIEW_CONTENT_SOURCE_LIST],
    [ROLES.SYSTEM]: [PERMISSIONS.TRIGGER_AI_GENERATION, PERMISSIONS.EXECUTE_DISTRIBUTION],
  };

  for (const [roleName, permissionNames] of Object.entries(rolePermissionMapping)) {
    const roleId = getRoleId(roleName);
    for (const permissionName of permissionNames) {
      const permissionId = getPermissionId(permissionName);

      await db
        .insert(rolePermissions)
        .values({
          roleId,
          permissionId,
        })
        .onConflictDoNothing();
    }
  }

  console.log("✅ Role-Permission mappings seeded");
  console.log("✨ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
