"use client";

import { useState } from "react";
import { useDistributionLogs } from "@/hooks/operator/use-distribution-logs";
import { LogsPageHeader } from "@/components/operator/logs/LogsPageHeader";
import { TableFilters } from "@/components/shared/TableFilters";
import { LogsTable } from "@/components/operator/logs/LogsTable";
import { createLogsColumns } from "@/components/operator/logs/LogsColumns";
import { LogDetailDrawer } from "@/components/operator/logs/drawer/LogDetailDrawer";
import type { LogItem } from "@/components/operator/logs/LogsColumns";

export default function LogsPageClient() {
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  const {
    data,
    isLoading,
    search,
    statusFilter,
    channelFilter,
    page,
    pageSize,
    totalPages,
    handleSearchChange,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleChannelFilterChange,
    handlePageChange,
  } = useDistributionLogs();

  const columns = createLogsColumns();

  return (
    <div className="flex-1 space-y-6 p-8">
      <LogsPageHeader totalLogs={data.data?.total ?? 0} />
      <TableFilters
        search={search}
        filters={{
          status: {
            value: statusFilter,
            onChange: handleStatusFilterChange,
            placeholder: "Filter by status",
            options: [
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "published", label: "Published" },
              { value: "failed", label: "Failed" },
            ],
          },
          channel: {
            value: channelFilter,
            onChange: handleChannelFilterChange,
            placeholder: "Filter by channel",
            options: [
              { value: "all", label: "All Channels" },
              { value: "newsletter", label: "Newsletter" },
              { value: "linkedin", label: "LinkedIn" },
              { value: "blog", label: "Blog" },
            ],
          },
        }}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <LogsTable
        columns={columns}
        data={data.data?.data ?? []}
        isLoading={isLoading}
        onRowClick={setSelectedLog}
        pagination={{
          page,
          pageSize,
          total: data.data?.total ?? 0,
          totalPages,
          onPageChange: handlePageChange,
        }}
      />
      {selectedLog && <LogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  );
}
