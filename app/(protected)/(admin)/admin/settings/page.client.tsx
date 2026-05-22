"use client";

import { useAdminSettings } from "@/hooks/admin/use-admin-settings";
import { useAuth } from "@/hooks/use-auth";
import { BannedPhrasesCard } from "@/components/admin/settings/BannedPhrasesCard";
import { LoopConfigCard } from "@/components/admin/settings/LoopConfigCard";
import { SystemConfigCard } from "@/components/admin/settings/SystemConfigCard";
import { TerminalIcon } from "lucide-react";

export default function AdminSettingsPageClient() {
  const { profile, user } = useAuth();
  const {
    systemConfig,
    bannedPhrases,
    updateSystemConfig,
    addBannedPhrase,
    deleteBannedPhrase,
    isLoading,
  } = useAdminSettings();

  const name = profile?.name || user?.email?.split("@")[0] || "User";

  const configData = systemConfig.data ?? [];
  const configMap = configData.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  const weeklyLoopEnabled = configMap["weekly_loop_enabled"] === "true";
  const loopDay = configMap["loop_day"] ?? null;
  const loopTime = configMap["loop_time"] ?? null;
  const supportedLanguages = configMap["supported_languages"]
    ? configMap["supported_languages"].split(",").map((v) => v.trim())
    : [];

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TerminalIcon className="h-8 w-8" />
            System Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {name}. Configure your system settings here.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <LoopConfigCard
            weeklyLoopEnabled={weeklyLoopEnabled}
            loopDay={loopDay}
            loopTime={loopTime}
            supportedLanguages={supportedLanguages}
            updateSystemConfig={updateSystemConfig}
            isLoading={updateSystemConfig.isPending}
          />

          <BannedPhrasesCard
            phrases={bannedPhrases.data ?? []}
            addBannedPhrase={addBannedPhrase}
            deleteBannedPhrase={deleteBannedPhrase}
            isLoading={addBannedPhrase.isPending || deleteBannedPhrase.isPending}
          />

          <SystemConfigCard config={configData} />
        </div>
      )}
    </div>
  );
}
