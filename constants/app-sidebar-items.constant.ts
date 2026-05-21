import { type LucideIcon } from "lucide-react";

import {
  FrameIcon,
  SettingsIcon,
  MapIcon,
  PieChartIcon,
  SendIcon,
  DatabaseIcon,
  UsersIcon,
  LayoutDashboardIcon,
  ActivityIcon,
  ShieldCheckIcon,
  TerminalIcon,
  LayersIcon,
  MessageSquareIcon,
  LibraryIcon,
  MonitorIcon,
  AlertCircleIcon,
  ListTodoIcon,
  FileTextIcon,
} from "lucide-react";

import { ROLES } from "@/drizzle/constants/roles-permissions.constant";

export interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavDrawerItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  subItems?: { title: string; url: string }[];
}

export interface SidebarGroup<T> {
  title: string;
  items: T[];
}

export interface RoleSidebarData {
  platform: SidebarGroup<NavItem>;
  drawer: SidebarGroup<NavDrawerItem>;
}

export const ROLE_SIDEBAR_DATA: Record<string, RoleSidebarData> = {
  [ROLES.ADMIN]: {
    platform: {
      title: "Admin Panel",
      items: [
        { name: "Analytics", url: "/admin/analytics", icon: PieChartIcon },
        { name: "User Management", url: "/admin/users", icon: UsersIcon },
        { name: "Security", url: "/admin/security", icon: ShieldCheckIcon },
        { name: "System Logs", url: "/admin/logs", icon: TerminalIcon },
      ],
    },
    drawer: {
      title: "Infrastructure",
      items: [
        {
          title: "Database",
          url: "#",
          icon: DatabaseIcon,
          subItems: [
            { title: "Tables", url: "/admin/db/tables" },
            { title: "Migrations", url: "/admin/db/migrations" },
          ],
        },
        {
          title: "Settings",
          url: "#",
          icon: SettingsIcon,
          subItems: [
            { title: "General", url: "/admin/settings/general" },
            { title: "API Keys", url: "/admin/settings/keys" },
          ],
        },
      ],
    },
  },
  [ROLES.CONTRIBUTOR]: {
    platform: {
      title: "Contributor Space",
      items: [
        { name: "My Work", url: "/contributor/work", icon: ListTodoIcon },
        { name: "Projects", url: "/contributor/projects", icon: LayersIcon },
        { name: "Knowledge Base", url: "/contributor/kb", icon: LibraryIcon },
        { name: "Discussions", url: "/contributor/chat", icon: MessageSquareIcon },
      ],
    },
    drawer: {
      title: "Resources",
      items: [
        {
          title: "Documents",
          url: "#",
          icon: FileTextIcon,
          subItems: [
            { title: "Drafts", url: "/contributor/docs/drafts" },
            { title: "Shared", url: "/contributor/docs/shared" },
          ],
        },
        {
          title: "Setup",
          url: "#",
          icon: SettingsIcon,
          subItems: [
            { title: "Profile", url: "/contributor/settings/profile" },
            { title: "Notifications", url: "/contributor/settings/alerts" },
          ],
        },
      ],
    },
  },
  [ROLES.OPERATOR]: {
    platform: {
      title: "Ops Control",
      items: [
        { name: "Live Monitor", url: "/operator/monitor", icon: MonitorIcon },
        { name: "System State", url: "/operator/state", icon: ActivityIcon },
        { name: "Incidents", url: "/operator/incidents", icon: AlertCircleIcon },
        { name: "Map View", url: "/operator/map", icon: MapIcon },
      ],
    },
    drawer: {
      title: "Operations",
      items: [
        {
          title: "Workflows",
          url: "#",
          icon: LayoutDashboardIcon,
          subItems: [
            { title: "Active", url: "/operator/flows/active" },
            { title: "History", url: "/operator/flows/history" },
          ],
        },
        {
          title: "Config",
          url: "#",
          icon: SettingsIcon,
          subItems: [
            { title: "Thresholds", url: "/operator/config/thresholds" },
            { title: "Alerts", url: "/operator/config/alerts" },
          ],
        },
      ],
    },
  },
};

export const SECONDARY_SIDEBAR_ITEMS: SidebarGroup<NavItem> = {
  title: "Support",
  items: [
    {
      name: "Feedback",
      url: "#",
      icon: SendIcon,
    },
    {
      name: "Help Center",
      url: "#",
      icon: LibraryIcon,
    },
  ],
};
