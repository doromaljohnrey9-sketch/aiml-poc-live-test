"use server";

import { and, count, desc, eq, like, or } from "drizzle-orm";

import { db } from "@/lib/drizzle/db";
import { requireRole } from "@/lib/guards/role.guard";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import {
  bannedPhrases,
  contentSources,
  distributionLogs,
  profiles,
  reviewStatuses,
  roles,
  systemConfig,
  userRoles,
} from "@/drizzle/schemas";
import { users } from "@/drizzle/schemas/auth/users.schema";
import type {
  AdminBannedPhrase,
  AdminDashboardSummary,
  AdminSystemConfigItem,
  AdminUser,
  AdminUserUpdate,
} from "@/types/admin.types";

const toISOString = (value: Date | string | null | undefined): string | null =>
  value instanceof Date ? value.toISOString() : (value ?? null);

const calculateNextRun = (loopDay: string, loopTime: string): string | null => {
  try {
    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const targetDay = dayMap[loopDay.toLowerCase()];
    if (targetDay === undefined) return null;

    const [hours, minutes] = loopTime.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    const now = new Date();
    const nextRun = new Date(now);

    nextRun.setUTCHours(hours, minutes, 0, 0);

    const currentDay = now.getUTCDay();
    const daysUntilTarget = (targetDay - currentDay + 7) % 7;

    if (daysUntilTarget === 0) {
      const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();
      const targetTime = hours * 60 + minutes;
      if (currentTime >= targetTime) {
        nextRun.setUTCDate(nextRun.getUTCDate() + 7);
      }
    } else {
      nextRun.setUTCDate(nextRun.getUTCDate() + daysUntilTarget);
    }

    return nextRun.toISOString();
  } catch {
    return null;
  }
};

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  await requireRole(ROLES.ADMIN);

  const [pendingCount] = await db
    .select({ count: count() })
    .from(contentSources)
    .where(eq(contentSources.status, "pending"));

  const [awaitingReviewCount] = await db
    .select({ count: count() })
    .from(reviewStatuses)
    .where(eq(reviewStatuses.status, "awaiting_review"));

  const [approvedCount] = await db
    .select({ count: count() })
    .from(reviewStatuses)
    .where(eq(reviewStatuses.status, "approved"));

  const [distributedCount] = await db
    .select({ count: count() })
    .from(distributionLogs)
    .where(eq(distributionLogs.status, "success"));

  const channelRows = await db
    .select({
      channel: distributionLogs.channel,
      total: count(),
    })
    .from(distributionLogs)
    .where(eq(distributionLogs.status, "success"))
    .groupBy(distributionLogs.channel);

  const failedRows = await db
    .select({
      id: distributionLogs.id,
      generatedContentId: distributionLogs.generatedContentId,
      channel: distributionLogs.channel,
      errorMessage: distributionLogs.errorMessage,
      failedAt: distributionLogs.updatedAt,
    })
    .from(distributionLogs)
    .where(eq(distributionLogs.status, "failed"))
    .orderBy(desc(distributionLogs.updatedAt))
    .limit(10);

  const configRows = await db
    .select({
      key: systemConfig.key,
      value: systemConfig.value,
      updatedBy: systemConfig.updatedBy,
      updatedAt: systemConfig.updatedAt,
    })
    .from(systemConfig);

  const configMap = configRows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  const lastRun = configMap["last_run"] ?? null;
  const itemsProcessed = Number(configMap["items_processed"] ?? 0);

  let nextRun: string | null = null;
  if (
    configMap["weekly_loop_enabled"] === "true" &&
    configMap["loop_day"] &&
    configMap["loop_time"]
  ) {
    nextRun = calculateNextRun(configMap["loop_day"], configMap["loop_time"]);
  }

  return {
    loopStatus: {
      weeklyLoopEnabled: configMap["weekly_loop_enabled"] === "true",
      loopDay: configMap["loop_day"] ?? null,
      loopTime: configMap["loop_time"] ?? null,
      supportedLanguages: configMap["supported_languages"]
        ? configMap["supported_languages"].split(",").map((value) => value.trim())
        : [],
      lastRun,
      nextRun,
      itemsProcessed,
    },
    pipelineCounts: {
      pending: Number(pendingCount.count ?? 0),
      awaitingReview: Number(awaitingReviewCount.count ?? 0),
      approved: Number(approvedCount.count ?? 0),
      distributed: Number(distributedCount.count ?? 0),
    },
    channelActivity: {
      linkedin: channelRows.find((row) => row.channel === "linkedin")?.total ?? 0,
      blog: channelRows.find((row) => row.channel === "blog")?.total ?? 0,
      newsletter: channelRows.find((row) => row.channel === "newsletter")?.total ?? 0,
    },
    failedDistributions: failedRows.map((row) => ({
      id: row.id,
      generatedContentId: row.generatedContentId ?? "",
      channel: row.channel,
      errorMessage: row.errorMessage,
      failedAt: toISOString(row.failedAt),
    })),
  };
}

export async function getAdminBannedPhrases(): Promise<AdminBannedPhrase[]> {
  await requireRole(ROLES.ADMIN);

  const rows = await db
    .select({
      id: bannedPhrases.id,
      phrase: bannedPhrases.phrase,
      addedBy: bannedPhrases.addedBy,
      addedByName: profiles.name,
      createdAt: bannedPhrases.createdAt,
    })
    .from(bannedPhrases)
    .leftJoin(profiles, eq(bannedPhrases.addedBy, profiles.id))
    .orderBy(desc(bannedPhrases.createdAt));

  return rows.map((row) => ({
    id: row.id,
    phrase: row.phrase,
    addedBy: row.addedBy,
    addedByName: row.addedByName,
    createdAt: toISOString(row.createdAt),
  }));
}

export async function getAdminSystemConfig(): Promise<AdminSystemConfigItem[]> {
  await requireRole(ROLES.ADMIN);

  const rows = await db
    .select({
      key: systemConfig.key,
      value: systemConfig.value,
      updatedBy: systemConfig.updatedBy,
      updatedAt: systemConfig.updatedAt,
    })
    .from(systemConfig)
    .orderBy(desc(systemConfig.updatedAt));

  return rows.map((row) => ({
    key: row.key,
    value: row.value,
    updatedBy: row.updatedBy,
    updatedAt: toISOString(row.updatedAt),
  }));
}

export async function getAdminUsers(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}): Promise<{ data: AdminUser[]; total: number }> {
  await requireRole(ROLES.ADMIN);

  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const offset = (page - 1) * pageSize;

  const conditions = [];

  if (params?.search) {
    const searchTerm = `%${params.search}%`;
    conditions.push(or(like(profiles.name, searchTerm), like(users.email, searchTerm)));
  }

  if (params?.role) {
    conditions.push(eq(roles.name, params.role));
  }

  if (params?.isActive !== undefined) {
    conditions.push(eq(profiles.isActive, params.isActive));
  }

  const [totalRows] = await db
    .select({ count: count() })
    .from(profiles)
    .leftJoin(userRoles, eq(profiles.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .leftJoin(users, eq(profiles.id, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      email: users.email,
      role: roles.name,
      isActive: profiles.isActive,
      createdAt: profiles.createdAt,
      updatedAt: profiles.updatedAt,
    })
    .from(profiles)
    .leftJoin(userRoles, eq(profiles.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .leftJoin(users, eq(profiles.id, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(profiles.createdAt))
    .limit(pageSize)
    .offset(offset);

  return {
    data: rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      isActive: Boolean(row.isActive),
      createdAt: toISOString(row.createdAt),
      updatedAt: toISOString(row.updatedAt),
    })),
    total: Number(totalRows.count),
  };
}

export async function addAdminBannedPhrase(phrase: string): Promise<AdminBannedPhrase> {
  const admin = await requireRole(ROLES.ADMIN);

  const [inserted] = await db
    .insert(bannedPhrases)
    .values({ phrase, addedBy: admin.id })
    .returning({
      id: bannedPhrases.id,
      phrase: bannedPhrases.phrase,
      addedBy: bannedPhrases.addedBy,
      createdAt: bannedPhrases.createdAt,
    });

  return {
    id: inserted.id,
    phrase: inserted.phrase,
    addedBy: inserted.addedBy,
    addedByName: null,
    createdAt: toISOString(inserted.createdAt),
  };
}

export async function deleteAdminBannedPhrase(id: string): Promise<boolean> {
  await requireRole(ROLES.ADMIN);

  const deleted = await db
    .delete(bannedPhrases)
    .where(eq(bannedPhrases.id, id))
    .returning({ id: bannedPhrases.id });

  return deleted.length > 0;
}

export async function updateAdminSystemConfig(
  key: string,
  value: string
): Promise<AdminSystemConfigItem> {
  const admin = await requireRole(ROLES.ADMIN);

  const existing = await db
    .select({ key: systemConfig.key })
    .from(systemConfig)
    .where(eq(systemConfig.key, key))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(systemConfig)
      .set({ value, updatedBy: admin.id, updatedAt: new Date() })
      .where(eq(systemConfig.key, key));
  } else {
    await db.insert(systemConfig).values({ key, value, updatedBy: admin.id });
  }

  return {
    key,
    value,
    updatedBy: admin.id,
    updatedAt: new Date().toISOString(),
  };
}

export async function updateAdminUser(
  id: string,
  updates: AdminUserUpdate
): Promise<AdminUser | null> {
  await requireRole(ROLES.ADMIN);

  if (updates.role) {
    const [roleRow] = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, updates.role))
      .limit(1);

    if (!roleRow) {
      throw new Error(`Role not found: ${updates.role}`);
    }

    await db.delete(userRoles).where(eq(userRoles.userId, id));
    await db.insert(userRoles).values({ userId: id, roleId: roleRow.id });
  }

  if (updates.isActive !== undefined) {
    await db.update(profiles).set({ isActive: updates.isActive }).where(eq(profiles.id, id));
  }

  const [userRow] = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      email: users.email,
      role: roles.name,
      isActive: profiles.isActive,
      createdAt: profiles.createdAt,
      updatedAt: profiles.updatedAt,
    })
    .from(profiles)
    .leftJoin(userRoles, eq(profiles.id, userRoles.userId))
    .leftJoin(roles, eq(userRoles.roleId, roles.id))
    .leftJoin(users, eq(profiles.id, users.id))
    .where(eq(profiles.id, id))
    .limit(1);

  if (!userRow) return null;

  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    isActive: Boolean(userRow.isActive),
    createdAt: toISOString(userRow.createdAt),
    updatedAt: toISOString(userRow.updatedAt),
  };
}
