"use client";

import { useAdminUserManagement } from "@/hooks/admin/use-admin-user-management";
import { UsersPageHeader } from "@/components/admin/user-management/UsersPageHeader";
import { UsersTable } from "@/components/admin/user-management/UsersTable";
import { UsersFilters } from "@/components/admin/user-management/UsersFilters";
import { createUsersColumns } from "@/components/admin/user-management/UsersColumns";

export function AdminUsersPageClient() {
  const {
    users,
    isLoading,
    updateUser,
    search,
    roleFilter,
    statusFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handlePageChange,
  } = useAdminUserManagement();

  const columns = createUsersColumns({ updateUser });

  return (
    <div className="flex-1 space-y-6 p-8">
      <UsersPageHeader />
      <UsersFilters
        search={search}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onRoleFilterChange={handleRoleFilterChange}
        onStatusFilterChange={handleStatusFilterChange}
      />
      <UsersTable
        columns={columns}
        data={users.data?.data ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: users.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
