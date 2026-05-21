"use client";

import { ChevronsUpDown, LogOut } from "lucide-react";
import type { SelectProfile } from "@/types/drizzle.types";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavUserProps {
  profile: SelectProfile | null;
  email: string | null | undefined;
  isLoading: boolean;
  handleSignOut: () => Promise<void>;
}

export const NavUser = ({ profile, email, handleSignOut, isLoading }: NavUserProps) => {
  const { isMobile } = useSidebar();

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-lg" />;
  }

  const imageUrl = profile?.imageUrl || undefined;
  const displayName = profile?.name || "Unknown User";
  const userRole = profile?.role || "";
  const userEmail = email || "No email";

  const userInfo = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={imageUrl} alt={displayName} />
        <AvatarFallback className="rounded-lg">{displayName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="truncate font-semibold">{displayName}</span>
          {userRole && (
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px] capitalize font-normal">
              {userRole}
            </Badge>
          )}
        </div>
        <span className="truncate text-xs text-muted-foreground">{userEmail}</span>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {userInfo}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {userInfo}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
