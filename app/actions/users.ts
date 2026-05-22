"use server";

import { eq } from "drizzle-orm";

import { db } from "@/lib/drizzle/db";
import { getSupabaseServer } from "@/lib/supabase/server";
import { profiles, roles, userRoles } from "@/drizzle/schemas";
import type { SelectProfile } from "@/types/drizzle.types";

export async function getCurrentUserProfile(): Promise<SelectProfile | null> {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const response = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      imageUrl: profiles.imageUrl,
      createdAt: profiles.createdAt,
      updatedAt: profiles.updatedAt,
      deletedAt: profiles.deletedAt,
      isActive: profiles.isActive,
      role: roles.name,
    })
    .from(profiles)
    .leftJoin(userRoles, eq(profiles.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(profiles.id, user.id))
    .limit(1);

  return response[0] ?? null;
}
