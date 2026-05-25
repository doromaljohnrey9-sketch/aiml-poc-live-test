import { buildMetadata } from "@/lib/seo";
import ReviewPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Review Queue",
  description: "Review content for approval.",
  path: "/operator/review",
});

export default function ReviewPage() {
  return <ReviewPageClient />;
}
