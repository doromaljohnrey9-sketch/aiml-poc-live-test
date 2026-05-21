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

export interface SidebarGroup<T> {
  title: string;
  items: T[];
}

export interface RoleSidebarData {
  platform: SidebarGroup<NavItem>;
}

export const ROLE_SIDEBAR_DATA: Record<string, RoleSidebarData> = {
  [ROLES.ADMIN]: {
    platform: {
      title: "Admin Panel",
      items: [
        { name: "Pipeline Status", url: "/admin/pipeline", icon: PieChartIcon },
        { name: "User Management", url: "/admin/users", icon: UsersIcon },
        { name: "Banned Phrases", url: "/admin/banned-phrases", icon: ShieldCheckIcon },
        { name: "System Settings", url: "/admin/settings", icon: TerminalIcon },
      ],
    },
  },
  [ROLES.CONTRIBUTOR]: {
    platform: {
      title: "Contributor Space",
      items: [
        { name: "Submit Content", url: "/contributor/submit", icon: SendIcon },
        { name: "My Submissions", url: "/contributor/submissions", icon: ListTodoIcon },
        { name: "Guidelines", url: "/contributor/guidelines", icon: LibraryIcon },
      ],
    },
  },
  [ROLES.OPERATOR]: {
    platform: {
      title: "Ops Control",
      items: [
        { name: "Review Queue", url: "/operator/review", icon: MonitorIcon },
        { name: "Distribution Hub", url: "/operator/distribution", icon: ActivityIcon },
        { name: "Activity Logs", url: "/operator/logs", icon: ListTodoIcon },
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
