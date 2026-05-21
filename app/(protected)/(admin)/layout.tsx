import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { requireRole } from "@/lib/guards/role.guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole(ROLES.ADMIN);

  return (
    <>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
