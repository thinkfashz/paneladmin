"use client";

import {
  BadgePercent,
  BarChart3,
  Bell,
  BookOpen,
  Box,
  Building,
  Calculator,
  Calendar,
  ChevronDown,
  CreditCard,
  Database,
  ExternalLink,
  FileText,
  Globe,
  Home,
  Kanban,
  Key,
  Layers,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Package,
  Paintbrush,
  Receipt,
  RotateCcw,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  external?: boolean;
};

type NavGroup = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    id: "negocio",
    label: "Mi Negocio",
    icon: Home,
    items: [
      { label: "Dashboard", href: "/admin", icon: Home },
      { label: "Analytics", href: "/admin/analytics", icon: TrendingUp },
      { label: "CRM", href: "/admin/crm", icon: BarChart3 },
      { label: "Clientes", href: "/admin/customers", icon: Users },
      { label: "Productos", href: "/admin/productos", icon: Package },
      { label: "Categorías", href: "/admin/categorias", icon: Layers },
      { label: "Inventario", href: "/admin/inventario", icon: Box },
      { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingCart },
      { label: "Cotizaciones", href: "/admin/cotizaciones", icon: FileText },
      { label: "Envíos", href: "/admin/envios", icon: Truck },
      { label: "Devoluciones", href: "/admin/devoluciones", icon: RotateCcw },
      { label: "Reseñas", href: "/admin/resenas", icon: Star },
      { label: "Cupones", href: "/admin/cupones", icon: Tag },
    ],
  },
  {
    id: "contabilidad",
    label: "Contabilidad",
    icon: Calculator,
    items: [
      { label: "F29 / SII", href: "/admin/contabilidad", icon: Calculator },
      {
        label: "Beneficios Fiscales",
        href: "/admin/beneficios",
        icon: BadgePercent,
      },
      { label: "Facturas Emitidas", href: "/admin/facturas", icon: Receipt },
      {
        label: "Facturas Recibidas",
        href: "/admin/facturas-recibidas",
        icon: Receipt,
      },
      { label: "Boletas Electrónicas", href: "/admin/boletas", icon: FileText },
      { label: "Gastos", href: "/admin/gastos", icon: CreditCard },
      { label: "Cuentas Bancarias", href: "/admin/bancos", icon: Building },
      { label: "Balance General", href: "/admin/balance", icon: Wallet },
      { label: "Flujo de Caja", href: "/admin/flujo", icon: TrendingUp },
      { label: "Impuestos", href: "/admin/impuestos", icon: FileText },
    ],
  },
  {
    id: "crm",
    label: "CRM & Ventas",
    icon: BarChart3,
    items: [
      { label: "Pipeline", href: "/admin/crm/pipeline", icon: BarChart3 },
      { label: "Leads", href: "/admin/crm/leads", icon: Users },
      {
        label: "Oportunidades",
        href: "/admin/crm/oportunidades",
        icon: TrendingUp,
      },
      { label: "Contactos", href: "/admin/crm/contactos", icon: Users },
      { label: "Empresas", href: "/admin/crm/empresas", icon: Building },
      { label: "Seguimientos", href: "/admin/crm/seguimientos", icon: Bell },
      { label: "Tareas CRM", href: "/admin/crm/tareas", icon: Kanban },
      {
        label: "Historial Ventas",
        href: "/admin/crm/historial",
        icon: FileText,
      },
      {
        label: "Informes Ventas",
        href: "/admin/crm/informes",
        icon: BarChart3,
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: Megaphone,
    items: [
      { label: "Campañas", href: "/admin/campanas", icon: Megaphone },
      { label: "Email Marketing", href: "/admin/email-marketing", icon: Mail },
      { label: "Redes Sociales", href: "/admin/redes-sociales", icon: Globe },
      { label: "Promociones", href: "/admin/promociones", icon: Tag },
      { label: "Cupones Mktg", href: "/admin/cupones-marketing", icon: Tag },
      { label: "SEO & Metadatos", href: "/admin/seo", icon: Globe },
      { label: "Landing Pages", href: "/admin/landing-pages", icon: Layers },
      { label: "Formularios", href: "/admin/formularios", icon: FileText },
      { label: "Pop-ups", href: "/admin/popups", icon: Bell },
    ],
  },
  {
    id: "herramientas",
    label: "Herramientas",
    icon: Wrench,
    items: [
      { label: "Correo", href: "/mail", icon: Mail },
      { label: "Calendario", href: "/calendar", icon: Calendar },
      { label: "Kanban / Tareas", href: "/kanban", icon: Kanban },
      { label: "Notas", href: "/admin/notas", icon: BookOpen },
      { label: "Documentos", href: "/admin/documentos", icon: FileText },
      { label: "Reportes", href: "/admin/reportes", icon: BarChart3 },
      { label: "Notificaciones", href: "/admin/notificaciones", icon: Bell },
      {
        label: "Importar / Exportar",
        href: "/admin/import-export",
        icon: Database,
      },
    ],
  },
  {
    id: "diseno",
    label: "Diseño & Tienda",
    icon: Paintbrush,
    items: [
      { label: "Editor de Tienda", href: "/admin/diseno", icon: Paintbrush },
      {
        label: "Temas & Colores",
        href: "/admin/diseno/temas",
        icon: Paintbrush,
      },
      {
        label: "Menús & Navegación",
        href: "/admin/diseno/menus",
        icon: Layers,
      },
      {
        label: "Banners & Sliders",
        href: "/admin/diseno/banners",
        icon: Layers,
      },
      {
        label: "Páginas Estáticas",
        href: "/admin/diseno/paginas",
        icon: FileText,
      },
      { label: "Dominio", href: "/admin/diseno/dominio", icon: Globe },
      { label: "SEO Tienda", href: "/admin/diseno/seo", icon: Globe },
      { label: "Redes Sociales", href: "/admin/diseno/social", icon: Globe },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    icon: Settings,
    items: [
      { label: "Configuración", href: "/admin/configuracion", icon: Settings },
      { label: "Empresa", href: "/admin/empresa", icon: Building },
      { label: "Usuarios del Sistema", href: "/admin/usuarios", icon: Users },
      { label: "Roles & Permisos", href: "/admin/roles", icon: Key },
      { label: "Integraciones", href: "/admin/integraciones", icon: Wrench },
      { label: "API & Webhooks", href: "/admin/api", icon: Database },
      { label: "Logs de Actividad", href: "/admin/logs", icon: FileText },
      { label: "Respaldos", href: "/admin/respaldos", icon: Database },
    ],
  },
  {
    id: "dashboards",
    label: "Dashboards",
    icon: LayoutDashboard,
    items: [
      { label: "Default", href: "/dashboard/default", icon: Home },
      { label: "CRM", href: "/dashboard/crm", icon: BarChart3 },
      { label: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
      { label: "E-Commerce", href: "/dashboard/ecommerce", icon: ShoppingBag },
      { label: "Finanzas", href: "/dashboard/finance", icon: Wallet },
      { label: "Productividad", href: "/dashboard/productivity", icon: Kanban },
      { label: "Logística", href: "/dashboard/logistics", icon: Truck },
      { label: "Academia", href: "/dashboard/academy", icon: BookOpen },
    ],
  },
];

function SidebarItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        isActive
          ? "bg-primary text-primary-foreground font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-3.5 shrink-0",
            isActive
              ? "text-primary-foreground"
              : "text-muted-foreground group-hover:text-foreground"
          )}
        />
      )}
      <span className="truncate">{item.label}</span>
      {item.external && (
        <ExternalLink className="ml-auto size-3 shrink-0 opacity-50" />
      )}
    </Link>
  );
}

function SidebarGroup({
  group,
  pathname,
  defaultOpen,
}: {
  group: NavGroup;
  pathname: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = group.icon;
  const hasActive = group.items.some(
    (item) =>
      pathname === item.href ||
      (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors",
          hasActive
            ? "text-primary"
            : "text-muted-foreground/70 hover:text-foreground"
        )}
      >
        <Icon className="size-3.5 shrink-0" />
        <span className="truncate">{group.label}</span>
        <ChevronDown
          className={cn(
            "ml-auto size-3.5 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>
      {open && (
        <div className="mt-0.5 space-y-0.5 pl-1">
          {group.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <SidebarItem key={item.href} item={item} isActive={isActive} />
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AdminSidebar({
  mobileOpen,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-3.5">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <LayoutDashboard className="size-4" />
        </div>
        <span className="font-semibold text-sm">Panel Admin</span>
        {onMobileClose && (
          <button
            type="button"
            onClick={onMobileClose}
            className="ml-auto rounded p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 [scrollbar-width:thin]">
        <div className="space-y-0.5">
          {NAV_GROUPS.map((group) => {
            const hasActive = group.items.some(
              (item) =>
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href))
            );
            return (
              <SidebarGroup
                key={group.id}
                group={group}
                pathname={pathname}
                defaultOpen={hasActive || group.id === "negocio"}
              />
            );
          })}
        </div>
      </nav>

      <div className="border-t px-2 py-2">
        <Link
          href="/auth/v1/login"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="size-4" />
          <span>Cerrar sesión</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r bg-background md:flex md:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-64 border-r bg-background shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
