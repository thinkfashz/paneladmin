import type { ReactNode } from "react";

import { cookies } from "next/headers";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BrandLoadingGate } from "@/fabrick/branding/components/brand-loading-gate";
import { getBrandTheme } from "@/fabrick/branding/get-brand-theme";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const brand = await getBrandTheme();

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="omnifix-admin-workspace"
      style={
        {
          "--sidebar-width": "18rem",
          "--sidebar-width-icon": "4.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="min-h-screen border-0 bg-transparent shadow-none md:m-0 md:rounded-none">
        <SidebarTrigger className="fixed top-4 left-4 z-50 rounded-2xl border border-white/10 bg-black/30 text-white shadow-2xl backdrop-blur-xl hover:bg-white/10 md:hidden" />
        <div className="min-h-screen p-4 pt-16 md:p-6 md:pt-6 has-data-[content-padding=false]:p-0 md:has-data-[content-padding=false]:p-0">
          <BrandLoadingGate brand={brand}>{children}</BrandLoadingGate>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
