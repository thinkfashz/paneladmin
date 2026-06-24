import type { CSSProperties, ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      defaultOpen
      className="omnifix-admin-workspace"
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "4.5rem",
        } as CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="min-h-screen border-0 bg-transparent shadow-none md:m-0 md:rounded-none">
        <SidebarTrigger className="fixed top-4 left-4 z-50 rounded-2xl border border-white/10 bg-black/30 text-white shadow-2xl backdrop-blur-xl hover:bg-white/10 md:hidden" />
        <div className="min-h-screen p-4 pt-16 md:p-6 md:pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
