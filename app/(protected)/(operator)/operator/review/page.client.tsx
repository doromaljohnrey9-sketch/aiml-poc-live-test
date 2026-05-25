"use client";

import { useState } from "react";
import { useOperatorReview } from "@/hooks/operator/use-operator-review";
import { ReviewPageHeader } from "@/components/operator/review/ReviewPageHeader";
import { ReviewTable } from "@/components/operator/review/ReviewTable";
import { createReviewColumns } from "@/components/operator/review/ReviewColumns";
import { ReviewDetailDrawer } from "@/components/operator/review/drawer/ReviewDetailDrawer";

export default function ReviewPageClient() {
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);

  const { awaiting, submit, isLoading } = useOperatorReview();

  const columns = createReviewColumns();

  return (
    <div className="flex-1 space-y-6 p-8">
      <ReviewPageHeader totalAwaitingReview={awaiting.data?.length ?? 0} />
      <ReviewTable
        columns={columns}
        data={awaiting.data ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedContentId}
      />
      {selectedContentId && (
        <ReviewDetailDrawer
          contentId={selectedContentId}
          onClose={() => setSelectedContentId(null)}
          onSubmitReview={(input) => {
            submit.mutate(input, {
              onSuccess: () => {
                setSelectedContentId(null);
              },
            });
          }}
          isSubmitting={submit.isPending}
        />
      )}
    </div>
  );
}
