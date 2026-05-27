import { buildMetadata } from "@/lib/seo";
import DistributionPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Distribution Hub",
  description: "Distribute approved content to channels.",
  path: "/operator/distribute",
});

export default function DistributionPage() {
  return <DistributionPageClient />;
}
