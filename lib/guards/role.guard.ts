import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { profiles, roles, userRoles } from "@/drizzle/schemas";
import { db } from "@/lib/drizzle/db";
import { getSupabaseServer } from "@/lib/supabase/server";
import { RoleName } from "@/drizzle/constants/roles-permissions.constant";

/**
 * Guard that requires a specific role to access a route.
 * If the user is not authenticated or does not have the required role, it throws a notFound() error.
 * @param allowedRole - The role name required to access the route
 * @returns The user profile with the role
 */
export async function requireRole(allowedRole: RoleName) {
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const response = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      imageUrl: profiles.imageUrl,
      createdAt: profiles.createdAt,
      updatedAt: profiles.updatedAt,
      role: roles.name,
    })
    .from(profiles)
    .leftJoin(userRoles, eq(profiles.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(profiles.id, user.id))
    .limit(1);

  const profile = response[0];

  if (!profile || profile.role !== allowedRole) {
    notFound();
  }

  return profile;
}
