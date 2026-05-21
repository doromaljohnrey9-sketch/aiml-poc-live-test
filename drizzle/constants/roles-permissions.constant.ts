export const ROLES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  CONTRIBUTOR: "contributor",
  SYSTEM: "system",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  VIEW_DASHBOARD: "view:dashboard",
  SUBMIT_CONTENT_SOURCE: "submit:content_source",
  VIEW_CONTENT_SOURCE_LIST: "view:content_source_list",
  TRIGGER_AI_GENERATION: "trigger:ai_generation",
  VIEW_GENERATED_CONTENT: "view:generated_content",
  APPROVE_REJECT_CONTENT: "approve_reject:content",
  EDIT_GENERATED_CONTENT: "edit:generated_content",
  EXECUTE_DISTRIBUTION: "execute:distribution",
  VIEW_DISTRIBUTION_LOGS: "view:distribution_logs",
  MANAGE_BANNED_PHRASES: "manage:banned_phrases",
  MANAGE_USERS_ROLES: "manage:users_roles",
  CONFIGURE_WEEKLY_LOOP: "configure:weekly_loop",
  EMERGENCY_STOP: "emergency_stop",
  VIEW_SYSTEM_SETTINGS: "view:system_settings",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
