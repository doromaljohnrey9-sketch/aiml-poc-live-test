export const getQueryKey = {
  users: {
    all: ["users"] as const,
    me: () => [...getQueryKey.users.all, "me"] as const,
  },
  admin: {
    all: ["admin"] as const,
    dashboardSummary: () => [...getQueryKey.admin.all, "dashboard-summary"] as const,
    bannedPhrases: () => [...getQueryKey.admin.all, "banned-phrases"] as const,
    systemConfig: () => [...getQueryKey.admin.all, "system-config"] as const,
    users: () => [...getQueryKey.admin.all, "users"] as const,
  },
  contentSources: {
    all: ["content-sources"] as const,
    mine: () => [...getQueryKey.contentSources.all, "mine"] as const,
    detail: (id: string) => [...getQueryKey.contentSources.all, "detail", id] as const,
  },
  operator: {
    all: ["operator"] as const,
    awaitingReview: () => [...getQueryKey.operator.all, "awaiting-review"] as const,
    generatedDetail: (id: string) => [...getQueryKey.operator.all, "generated", id] as const,
    approved: () => [...getQueryKey.operator.all, "approved"] as const,
    distributionLogs: (id?: string) =>
      id
        ? ([...getQueryKey.operator.all, "distribution", id] as const)
        : ([...getQueryKey.operator.all, "distribution"] as const),
    summary: () => [...getQueryKey.operator.all, "summary"] as const,
  },
} as const;
