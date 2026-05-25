"use client";

import { useState } from "react";
import {
  useOperatorDistribution,
  type PublishInput,
} from "@/hooks/operator/use-operator-distribution";
import { DistributionPageHeader } from "@/components/operator/distribute/DistributionPageHeader";
import { DistributionTable } from "@/components/operator/distribute/DistributionTable";
import { createDistributionColumns } from "@/components/operator/distribute/DistributionColumns";
import { DistributionDetailDrawer } from "@/components/operator/distribute/drawer/DistributionDetailDrawer";

export default function DistributionPageClient() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const { approved, publish, isLoading } = useOperatorDistribution();

  const columns = createDistributionColumns();

  return (
    <div className="flex-1 space-y-6 p-8">
      <DistributionPageHeader totalApproved={approved.data?.length ?? 0} />
      <DistributionTable
        columns={columns}
        data={approved.data ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedContentId}
      />
      {selectedContentId && (
        <DistributionDetailDrawer
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          onPublish={(input: PublishInput) => {
            publish.mutate(input, {
              onSuccess: () => {
                setSelectedContentId(null);
              },
            });
          }}
          isPublishing={publish.isPending}
        />
      )}
    </div>
  );
}
