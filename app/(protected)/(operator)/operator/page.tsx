import { buildMetadata } from "@/lib/seo";
import OperatorPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Operator",
  description: "Operator overview.",
  path: "/operator",
});

export default function OperatorPage() {
  return <OperatorPageClient />;
}
