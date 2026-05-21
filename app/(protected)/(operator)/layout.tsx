import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ROLES } from "@/drizzle/constants/roles-permissions.constant";
import { requireRole } from "@/lib/guards/role.guard";

export default async function OperatorLayout({ children }: { children: React.ReactNode }) {
  await requireRole(ROLES.OPERATOR);

  return (
    <>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </>
  );
}
