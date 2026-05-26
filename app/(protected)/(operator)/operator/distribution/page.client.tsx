"use client";

import { useState } from "react";
import {
  useOperatorDistribution,
  type PublishInput,
} from "@/hooks/operator/use-operator-distribution";
import { DistributionPageHeader } from "@/components/operator/distribute/DistributionPageHeader";
import { TableFilters } from "@/components/shared/TableFilters";
import { DistributionTable } from "@/components/operator/distribute/DistributionTable";
import { createDistributionColumns } from "@/components/operator/distribute/DistributionColumns";
import { DistributionDetailDrawer } from "@/components/operator/distribute/drawer/DistributionDetailDrawer";
import { toast } from "sonner";

export default function DistributionPageClient() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const {
    approved,
    publish,
    isLoading,
    search,
    languageFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleLanguageFilterChange,
    handlePageChange,
  } = useOperatorDistribution();

  const columns = createDistributionColumns();

  const handlePublish = (input: PublishInput) => {
    publish.mutate(input, {
      onSuccess: () => {
        setSelectedContentId(null);
        toast.success(`Content distributed to ${input.channels.join(", ")}`);
      },
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      <DistributionPageHeader totalApproved={approved.data?.total ?? 0} />
      <TableFilters
        search={search}
        filters={{
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
      <DistributionTable
        columns={columns}
        data={approved.data?.data ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedContentId}
        pagination={{
          page,
          pageSize,
          total: approved.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
      {selectedContentId && (
        <DistributionDetailDrawer
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          onPublish={handlePublish}
          isPublishing={publish.isPending}
        />
      )}
    </div>
  );
}
