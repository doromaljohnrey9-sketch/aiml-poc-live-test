"use client";

import * as React from "react";
import { Command } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/app-sidebar/nav-user";

import { NavItems } from "./nav-items";
import { NavLoader } from "./nav-loader";

import { ROLE_SIDEBAR_DATA } from "@/constants/app-sidebar-items.constant";

import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const router = useRouter();
  const supabase = getSupabaseClient();

  const { user, profile, isLoading } = useAuth();
  const role = profile?.role;

  // Fallback to Operator or a default set if role is missing/loading
  const sidebarData = role ? ROLE_SIDEBAR_DATA[role] : null;

  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      queryClient.clear();
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign out failed", { description: "Please try again." });
    }
  };

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium uppercase tracking-tight">AIML System</span>
                  <span className="truncate text-xs">Marketing Automation Loop</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? <NavLoader /> : sidebarData && <NavItems {...sidebarData.platform} />}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          profile={profile}
          email={user?.email}
          handleSignOut={handleSignOut}
          isLoading={isLoading}
        />
      </SidebarFooter>
    </Sidebar>
  );
};
