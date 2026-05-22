import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDownIcon,
  MoreHorizontalIcon,
  ShieldIcon,
  UserIcon,
  ShieldCheckIcon,
  PowerIcon,
  PowerOffIcon,
} from "lucide-react";
import { toast } from "sonner";
import type { AdminUser } from "@/types/admin.types";
import type { useAdminUserManagement } from "@/hooks/admin/use-admin-user-management";

interface UsersColumnsProps {
  updateUser: ReturnType<typeof useAdminUserManagement>["updateUser"];
}

export function createUsersColumns({ updateUser }: UsersColumnsProps): ColumnDef<AdminUser>[] {
  return [
    {
      id: "spacer",
      header: () => null,
      cell: () => null,
      size: 48,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Name
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Email
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue("email") || "—"}</div>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Role
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const role = row.getValue("role") as string | null;
        return (
          <Badge variant={role === "admin" ? "default" : "secondary"} className="capitalize">
            {role || "No Role"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Status
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "destructive"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            Created
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | null;
        if (!createdAt) return <div className="text-muted-foreground">—</div>;
        return (
          <div className="text-muted-foreground">{new Date(createdAt).toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        const handleRoleChange = (newRole: string) => {
          updateUser.mutate(
            { id: user.id, updates: { role: newRole } },
            {
              onSuccess: () => {
                toast.success(`Role updated to ${newRole}`);
              },
              onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to update role");
              },
            }
          );
        };

        const handleStatusToggle = () => {
          updateUser.mutate(
            { id: user.id, updates: { isActive: !user.isActive } },
            {
              onSuccess: () => {
                toast.success(`User ${user.isActive ? "deactivated" : "activated"}`);
              },
              onError: (error) => {
                toast.error(error instanceof Error ? error.message : "Failed to update status");
              },
            }
          );
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleStatusToggle}
                variant={user.isActive ? "destructive" : "default"}
              >
                {user.isActive ? (
                  <>
                    <PowerOffIcon className="mr-2 h-4 w-4" />
                    Deactivate User
                  </>
                ) : (
                  <>
                    <PowerIcon className="mr-2 h-4 w-4" />
                    Activate User
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("admin")}>
                <ShieldCheckIcon className="mr-2 h-4 w-4" />
                Make Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("contributor")}>
                <UserIcon className="mr-2 h-4 w-4" />
                Make Contributor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange("operator")}>
                <ShieldIcon className="mr-2 h-4 w-4" />
                Make Operator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
