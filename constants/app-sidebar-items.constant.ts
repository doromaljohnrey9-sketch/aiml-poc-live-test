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
        { name: "Dashboard", url: "/admin", icon: PieChartIcon },
        { name: "Users", url: "/admin/users", icon: UsersIcon },
        { name: "Settings", url: "/admin/settings", icon: TerminalIcon },
      ],
    },
  },
  [ROLES.CONTRIBUTOR]: {
    platform: {
      title: "Contributor Space",
      items: [{ name: "My Submissions", url: "/contributor", icon: ListTodoIcon }],
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
