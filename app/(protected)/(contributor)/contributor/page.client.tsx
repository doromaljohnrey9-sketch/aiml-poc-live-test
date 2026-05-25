"use client";

import { useState } from "react";
import { useContributorSources } from "@/hooks/contributor/use-contributor-sources";
import { SubmissionsPageHeader } from "@/components/contributor/submissions/SubmissionsPageHeader";
import { SubmissionsFilters } from "@/components/contributor/submissions/SubmissionsFilters";
import { SubmissionsTable } from "@/components/contributor/submissions/SubmissionsTable";
import { createSubmissionsColumns } from "@/components/contributor/submissions/SubmissionsColumns";
import { SubmitContentDialog } from "@/components/contributor/submissions/dialog/SubmitContentDialog";
import { toast } from "sonner";
import type { ContentSourceInput } from "@/types/contributor.types";

export default function ContributorPageClient() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    mySources,
    isLoading,
    search,
    statusFilter,
    languageFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleLanguageFilterChange,
    handlePageChange,
    createSource,
  } = useContributorSources();

  const columns = createSubmissionsColumns();

  const handleSubmit = (input: ContentSourceInput) => {
    createSource.mutate(input, {
      onSuccess: () => {
        toast.success("Content submitted successfully");
        setIsDialogOpen(false);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to submit content");
      },
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <SubmissionsPageHeader onCreateNew={() => setIsDialogOpen(true)} />
      <SubmissionsFilters
        search={search}
        statusFilter={statusFilter}
        languageFilter={languageFilter}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onStatusFilterChange={handleStatusFilterChange}
        onLanguageFilterChange={handleLanguageFilterChange}
      />
      <SubmissionsTable
        columns={columns}
        data={mySources.data?.data ?? []}
        isLoading={isLoading}
        pagination={{
          page,
          pageSize,
          total: mySources.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
      <SubmitContentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        isSubmitting={createSource.isPending}
      />
    </div>
  );
}
