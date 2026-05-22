export type AdminDashboardSummary = {
  loopStatus: {
    weeklyLoopEnabled: boolean;
    loopDay: string | null;
    loopTime: string | null;
    supportedLanguages: string[];
    lastRun: string | null;
    nextRun: string | null;
    itemsProcessed: number;
  };
  pipelineCounts: {
    pending: number;
    awaitingReview: number;
    approved: number;
    distributed: number;
  };
  channelActivity: {
    linkedin: number;
    blog: number;
    newsletter: number;
  };
  failedDistributions: Array<{
    id: string;
    generatedContentId: string;
    channel: string;
    errorMessage: string | null;
    failedAt: string | null;
  }>;
};

export type AdminBannedPhrase = {
  id: string;
  phrase: string;
  addedBy: string | null;
  addedByName: string | null;
  createdAt: string | null;
};

export type AdminSystemConfigItem = {
  key: string;
  value: string;
  updatedBy: string | null;
  updatedAt: string | null;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

type UpdateAdminUserInput = {
  role?: string;
  isActive?: boolean;
};

export type AdminUserUpdate = UpdateAdminUserInput;
