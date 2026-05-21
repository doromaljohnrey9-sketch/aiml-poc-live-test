import { buildMetadata } from "@/lib/seo";
import AdminPageClient from "./page.client";

export const metadata = buildMetadata({
  title: "Admin",
  description: "Admin overview.",
  path: "/admin",
});

export default function AdminPage() {
  return <AdminPageClient />;
}
