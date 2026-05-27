import { buildMetadata } from "@/lib/seo";
import LogsPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Activity Logs",
  description: "View distribution activity logs.",
  path: "/operator/logs",
});

export default function LogsPage() {
  return <LogsPageClient />;
}
