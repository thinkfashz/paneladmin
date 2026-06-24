"use client";

import Link from "next/link";

import { BadgeCheck, Radio } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";
import { rootUser } from "@/data/users";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";
import { cn } from "@/lib/utils";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isSynced } = usePreferencesStore(
    useShallow((s) => ({
      isSynced: s.isSynced,
    })),
  );

  // Mantiene una experiencia estable tipo glass/rail aunque existan preferencias anteriores guardadas.
  const _ready = isSynced;

  return (
    <Sidebar
      {...props}
      variant="floating"
      collapsible="icon"
      className={cn("omnifix-glass-sidebar", className)}
    >
      <SidebarHeader className="px-3 pt-3 pb-2">
        <div className="mb-3 flex items-center gap-1.5 px-2 pt-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <span className="size-2.5 rounded-full bg-red-400 shadow-[0_0_16px_rgba(248,113,113,.75)]" />
          <span className="size-2.5 rounded-full bg-yellow-300 shadow-[0_0_16px_rgba(253,224,71,.65)]" />
          <span className="size-2.5 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.65)]" />
        </div>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="omnifix-brand-button min-h-14">
              <Link prefetch={false} href="/admin">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-white/10 shadow-2xl shadow-red-500/20 backdrop-blur-xl">
                  <OmnifixLogo className="size-8" />
                </span>
                <span className="grid min-w-0 leading-tight">
                  <span className="truncate font-black text-lg tracking-tight">Omnifix</span>
                  <span className="truncate font-bold text-[10px] text-rose-100/70 uppercase tracking-[.24em]">
                    Todo tiene solución
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-3 py-2 text-[11px] font-black uppercase tracking-widest text-rose-100/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <Radio className="size-3.5 text-rose-200" />
          <span className="group-data-[collapsible=icon]:hidden">Menú</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 pb-2">
        <NavMain items={sidebarItems} />
      </SidebarContent>

      <SidebarFooter className="border-white/10 border-t bg-black/10 p-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[.06] px-3 py-2 text-xs text-rose-100/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <BadgeCheck className="size-4 text-emerald-300" />
          <span className="font-semibold group-data-[collapsible=icon]:hidden">Sistema online</span>
        </div>
        <NavUser user={rootUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
