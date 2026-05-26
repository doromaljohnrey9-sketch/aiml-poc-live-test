"use client";

import { useState } from "react";
import { useContributorSources } from "@/hooks/contributor/use-contributor-sources";
import { SubmissionsPageHeader } from "@/components/contributor/submissions/SubmissionsPageHeader";
import { TableFilters } from "@/components/shared/TableFilters";
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
      <TableFilters
        search={search}
        filters={{
          status: {
            value: statusFilter,
            onChange: handleStatusFilterChange,
            placeholder: "Filter by status",
            options: [
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "processed", label: "Processed" },
              { value: "failed", label: "Failed" },
            ],
          },
          language: {
            value: languageFilter,
            onChange: handleLanguageFilterChange,
            placeholder: "Filter by language",
            options: [
              { value: "all", label: "All Languages" },
              { value: "en", label: "English" },
              { value: "ko", label: "Korean" },
            ],
          },
        }}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
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
