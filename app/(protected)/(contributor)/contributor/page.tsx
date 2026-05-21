import { buildMetadata } from "@/lib/seo";
import ContributorPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Contributor",
  description: "Contributor overview.",
  path: "/contributor",
});

export default function ContributorPage() {
  return <ContributorPageClient />;
}
