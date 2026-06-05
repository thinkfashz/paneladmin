"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BarChart3, Calculator, ChevronLeft, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin/crm", label: "CRM & Agenda", icon: BarChart3 },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/contabilidad", label: "Contabilidad / F29", icon: Calculator },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 md:px-6">
        <Button asChild variant="ghost" size="sm" className="shrink-0 gap-1.5 text-muted-foreground">
          <Link href="/dashboard/default">
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Panel</span>
          </Link>
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {adminNav.map(({ href, label, icon: Icon }) => (
            <Button
              key={href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "shrink-0 gap-2 font-medium",
                pathname.startsWith(href) && "bg-accent text-accent-foreground",
              )}
            >
              <Link href={href}>
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(" ")[0]}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}
