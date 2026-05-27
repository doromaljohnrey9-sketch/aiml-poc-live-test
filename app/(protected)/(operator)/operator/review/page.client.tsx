"use client";

import { useState } from "react";
import { useOperatorReview } from "@/hooks/operator/use-operator-review";
import { ReviewPageHeader } from "@/components/operator/review/ReviewPageHeader";
import { TableFilters } from "@/components/shared/TableFilters";
import { ReviewTable } from "@/components/operator/review/ReviewTable";
import { createReviewColumns } from "@/components/operator/review/ReviewColumns";
import { ReviewDetailDrawer } from "@/components/operator/review/drawer/ReviewDetailDrawer";
import { toast } from "sonner";

export default function ReviewPageClient() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const {
    awaiting,
    submit,
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
  } = useOperatorReview();

  const columns = createReviewColumns();

  const handleSubmitReview = (input: any) => {
    submit.mutate(input, {
      onSuccess: () => {
        setSelectedContentId(null);
        toast.success(
          input.status === "approved"
            ? "Content approved successfully"
            : "Content rejected successfully"
        );
      },
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <ReviewPageHeader totalAwaitingReview={awaiting.data?.total ?? 0} />
      <TableFilters
        search={search}
        filters={{
          status: {
            value: statusFilter,
            onChange: handleStatusFilterChange,
            placeholder: "Filter by status",
            options: [
              { value: "all", label: "All Statuses" },
              { value: "awaiting_review", label: "Awaiting Review" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
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
      <ReviewTable
        columns={columns}
        data={awaiting.data?.data ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedContentId}
        pagination={{
          page,
          pageSize,
          total: awaiting.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
      {selectedContentId && (
        <ReviewDetailDrawer
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          onSubmitReview={handleSubmitReview}
          isSubmitting={submit.isPending}
        />
      )}
    </div>
  );
}
