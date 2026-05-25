"use client";

import { useState } from "react";
import { useDistributionLogs } from "@/hooks/operator/use-distribution-logs";
import { LogsPageHeader } from "@/components/operator/logs/LogsPageHeader";
import { LogsTable } from "@/components/operator/logs/LogsTable";
import { createLogsColumns } from "@/components/operator/logs/LogsColumns";
import { LogDetailDrawer } from "@/components/operator/logs/drawer/LogDetailDrawer";
import type { LogItem } from "@/components/operator/logs/LogsColumns";

export default function LogsPageClient() {
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  const { data: logs, isLoading } = useDistributionLogs();

  const columns = createLogsColumns();

  return (
    <div className="flex-1 space-y-6 p-8">
      <LogsPageHeader totalLogs={logs?.length ?? 0} />
      <LogsTable
        columns={columns}
        data={logs ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedLog}
      />
      {selectedLog && <LogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
