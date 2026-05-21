import { PropsWithChildren } from "react";

import { SiteHeader } from "@/components/app-sidebar/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex w-full flex-1">{children}</div>
      </SidebarProvider>
    </div>
  );
}
