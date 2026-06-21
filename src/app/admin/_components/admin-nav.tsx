"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { ADMIN_PRIMARY_NAV } from "@/fabrick/navigation/admin-modules";
import { cn } from "@/lib/utils";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2.5 sm:px-6">
        <Link href="/admin" className="flex shrink-0 items-center gap-1.5 font-bold text-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-600 text-white text-xs shadow-sm shadow-blue-500/30">
            O
          </span>
          <span className="hidden sm:inline">Omnifix</span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <nav className="flex flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none">
          {ADMIN_PRIMARY_NAV.map(({ href, shortLabel, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-muted-foreground hover:bg-blue-500/10 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{shortLabel}</span>
              </Link>
            );
          })}
        </nav>
        <Separator orientation="vertical" className="h-5" />
        <Link
          href="/admin"
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-blue-500/10 hover:text-foreground"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Hub</span>
        </Link>
      </div>
    </header>
  );
}
