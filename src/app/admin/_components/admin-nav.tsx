"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calculator,
  FileText,
  Package,
  Paintbrush,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin/crm", label: "CRM & Agenda", icon: BarChart3 },
  { href: "/admin/customers", label: "Clientes", icon: Users },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/contabilidad", label: "Contabilidad / F29", icon: Calculator },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/admin/diseno", label: "Diseño", icon: Paintbrush },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold shrink-0">
          <span className="text-primary">●</span>
          <span className="hidden sm:inline">Admin</span>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label.split(" ")[0]}</span>
                <span className="inline sm:hidden">{label.split(" ")[0].slice(0, 3)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
