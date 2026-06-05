# PROMPT DE INTEGRACIÓN — Panel Admin con Sidebar y Módulos de Negocio

## CONTEXTO

Tengo un proyecto Next.js (App Router, TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react, recharts).
Necesito que integres en él una sección `/admin` completa con:
- Layout propio con sidebar lateral izquierdo colapsable
- 13 archivos de páginas funcionales (mock data, sin backend)
- El sidebar tiene 80+ ítems organizados en 8 grupos, con active state persistente via `usePathname`

## REQUISITOS PREVIOS DE TU PROYECTO

Asegúrate de tener instaladas estas dependencias:
```bash
npm install lucide-react recharts
```
Y que exista `@/lib/utils` exportando `cn` (clsx + tailwind-merge):
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

---

## ARCHIVOS A CREAR

Crea exactamente estos 13 archivos con el contenido que se indica a continuación.
Respeta la ruta de cada uno.

---

### 1. `src/app/page.tsx`
```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/admin");
}
```

---

### 2. `src/app/admin/layout.tsx`
```tsx
"use client";

import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b bg-background px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Menu className="size-5" />
          </button>
          <span className="font-semibold text-sm">Panel Admin</span>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

---

### 3. `src/app/admin/_components/admin-sidebar.tsx`
```tsx
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
      { label: "Beneficios Fiscales", href: "/admin/beneficios", icon: BadgePercent },
      { label: "Facturas Emitidas", href: "/admin/facturas", icon: Receipt },
      { label: "Facturas Recibidas", href: "/admin/facturas-recibidas", icon: Receipt },
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
      { label: "Oportunidades", href: "/admin/crm/oportunidades", icon: TrendingUp },
      { label: "Contactos", href: "/admin/crm/contactos", icon: Users },
      { label: "Empresas", href: "/admin/crm/empresas", icon: Building },
      { label: "Seguimientos", href: "/admin/crm/seguimientos", icon: Bell },
      { label: "Tareas CRM", href: "/admin/crm/tareas", icon: Kanban },
      { label: "Historial Ventas", href: "/admin/crm/historial", icon: FileText },
      { label: "Informes Ventas", href: "/admin/crm/informes", icon: BarChart3 },
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
      { label: "Importar / Exportar", href: "/admin/import-export", icon: Database },
    ],
  },
  {
    id: "diseno",
    label: "Diseño & Tienda",
    icon: Paintbrush,
    items: [
      { label: "Editor de Tienda", href: "/admin/diseno", icon: Paintbrush },
      { label: "Temas & Colores", href: "/admin/diseno/temas", icon: Paintbrush },
      { label: "Menús & Navegación", href: "/admin/diseno/menus", icon: Layers },
      { label: "Banners & Sliders", href: "/admin/diseno/banners", icon: Layers },
      { label: "Páginas Estáticas", href: "/admin/diseno/paginas", icon: FileText },
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
          hasActive ? "text-primary" : "text-muted-foreground/70 hover:text-foreground"
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
      <aside className="hidden w-56 shrink-0 border-r bg-background md:flex md:flex-col">
        {sidebarContent}
      </aside>

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
```

---

### 4. `src/app/admin/page.tsx`
```tsx
import {
  BadgePercent,
  BarChart3,
  Calculator,
  FileText,
  Package,
  Paintbrush,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const MODULES = [
  {
    href: "/admin/crm",
    icon: BarChart3,
    label: "CRM",
    description: "Pipeline, leads y oportunidades de venta",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
  },
  {
    href: "/admin/customers",
    icon: Users,
    label: "Clientes",
    description: "Gestión de clientes y contactos",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
  },
  {
    href: "/admin/productos",
    icon: Package,
    label: "Productos",
    description: "Catálogo, inventario y precios",
    color: "text-orange-600 bg-orange-50 dark:bg-orange-950/40",
  },
  {
    href: "/admin/analytics",
    icon: TrendingUp,
    label: "Analytics",
    description: "Métricas de ventas y tráfico",
    color: "text-green-600 bg-green-50 dark:bg-green-950/40",
  },
  {
    href: "/admin/contabilidad",
    icon: Calculator,
    label: "F29 / SII",
    description: "IVA, PPM y declaraciones tributarias",
    color: "text-red-600 bg-red-50 dark:bg-red-950/40",
  },
  {
    href: "/admin/beneficios",
    icon: BadgePercent,
    label: "Beneficios Fiscales",
    description: "Ahorro tributario y créditos disponibles",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    href: "/admin/cotizaciones",
    icon: FileText,
    label: "Cotizaciones",
    description: "Propuestas y seguimiento de negocios",
    color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40",
  },
  {
    href: "/admin/diseno",
    icon: Paintbrush,
    label: "Diseño",
    description: "Apariencia y personalización de tienda",
    color: "text-pink-600 bg-pink-50 dark:bg-pink-950/40",
  },
  {
    href: "/admin/configuracion",
    icon: Settings,
    label: "Configuración",
    description: "Ajustes generales de la empresa",
    color: "text-gray-600 bg-gray-100 dark:bg-gray-800/60",
  },
] as const;

export default function AdminPage() {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const dueDate = now.getDate() > 12 && now.getMonth() % 2 === 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">{greeting} 👋</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          {now.toLocaleDateString("es-CL", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {dueDate && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <span className="font-semibold">⚠️ F29 próximo</span> — Recuerda que el
          plazo de declaración mensual puede estar próximo. Revisa tu estado en{" "}
          <Link href="/admin/contabilidad" className="underline underline-offset-2">
            Contabilidad
          </Link>
          .
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${mod.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary">{mod.label}</p>
                <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{mod.description}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold text-sm">Acceso rápido</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            ["Nueva cotización", "/admin/cotizaciones"],
            ["Agregar producto", "/admin/productos"],
            ["Ver pedidos", "/admin/pedidos"],
            ["F29 actual", "/admin/contabilidad"],
            ["Beneficios fiscales", "/admin/beneficios"],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border bg-background px-3 py-1 text-xs transition-colors hover:bg-accent hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 5. `src/app/admin/crm/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_LEADS = [
  { id: "1", name: "Restaurante La Cima", contact: "Pedro Soto", value: 1200000, stage: "Propuesta", prob: 60 },
  { id: "2", name: "Clínica Norte", contact: "Ana García", value: 3500000, stage: "Negociación", prob: 80 },
  { id: "3", name: "Ferretería López", contact: "Juan López", value: 450000, stage: "Contacto inicial", prob: 20 },
  { id: "4", name: "Hotel Bello", contact: "María Silva", value: 2100000, stage: "Calificación", prob: 40 },
  { id: "5", name: "Farmacia Cruz", contact: "Diego Muñoz", value: 780000, stage: "Propuesta", prob: 55 },
  { id: "6", name: "Taller Mecánico JM", contact: "José Morales", value: 320000, stage: "Contacto inicial", prob: 15 },
];

const STAGES = ["Todos", "Contacto inicial", "Calificación", "Propuesta", "Negociación", "Cerrado"];

const STAGE_COLOR: Record<string, string> = {
  "Contacto inicial": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  "Calificación": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Propuesta": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Negociación": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Cerrado": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default function CrmPage() {
  const [filter, setFilter] = useState("Todos");
  const leads = filter === "Todos" ? MOCK_LEADS : MOCK_LEADS.filter((l) => l.stage === filter);
  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const weightedValue = leads.reduce((s, l) => s + l.value * (l.prob / 100), 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">CRM & Pipeline de Ventas</h1>
        <p className="mt-1 text-muted-foreground text-sm">Seguimiento de oportunidades y leads activos</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Oportunidades", value: MOCK_LEADS.length.toString() },
          { label: "Valor total", value: fmt(totalValue) },
          { label: "Valor ponderado", value: fmt(weightedValue) },
          { label: "Tasa de cierre", value: "38%" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-wrap gap-1.5 border-b px-4 py-3">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="divide-y">
          {leads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-4 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{lead.name}</p>
                <p className="text-muted-foreground text-xs">{lead.contact}</p>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", STAGE_COLOR[lead.stage] ?? "bg-muted text-muted-foreground")}>
                {lead.stage}
              </span>
              <div className="text-right">
                <p className="font-semibold text-sm">{fmt(lead.value)}</p>
                <p className="text-muted-foreground text-xs">{lead.prob}% prob.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 6. `src/app/admin/customers/page.tsx`
```tsx
"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const MOCK_CUSTOMERS = [
  { id: "1", name: "María González", email: "maria@gmail.com", rut: "12.345.678-9", orders: 12, total: 4500000, segment: "Premium" },
  { id: "2", name: "Carlos Rodríguez", email: "carlos@empresa.cl", rut: "9.876.543-2", orders: 5, total: 980000, segment: "Regular" },
  { id: "3", name: "Laura Martínez", email: "laura.m@hotmail.com", rut: "15.432.109-8", orders: 28, total: 12100000, segment: "VIP" },
  { id: "4", name: "Diego Morales", email: "dmorales@yahoo.com", rut: "11.223.344-5", orders: 3, total: 240000, segment: "Nuevo" },
  { id: "5", name: "Ana Silva", email: "ana.silva@empresa.cl", rut: "14.567.890-1", orders: 8, total: 2340000, segment: "Regular" },
  { id: "6", name: "Pedro Soto", email: "psoto@gmail.com", rut: "8.765.432-1", orders: 19, total: 7800000, segment: "Premium" },
];

const SEGMENT_COLOR: Record<string, string> = {
  VIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Premium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Regular: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Nuevo: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const customers = MOCK_CUSTOMERS.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Clientes</h1>
        <p className="mt-1 text-muted-foreground text-sm">Base de clientes y segmentación</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total clientes", value: MOCK_CUSTOMERS.length.toString() },
          { label: "VIP / Premium", value: MOCK_CUSTOMERS.filter((c) => ["VIP", "Premium"].includes(c.segment)).length.toString() },
          { label: "Pedidos promedio", value: Math.round(MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0) / MOCK_CUSTOMERS.length).toString() },
          { label: "Valor promedio", value: fmt(MOCK_CUSTOMERS.reduce((s, c) => s + c.total, 0) / MOCK_CUSTOMERS.length) },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Cliente</th>
                <th className="px-4 py-2.5 font-medium">RUT</th>
                <th className="px-4 py-2.5 font-medium">Segmento</th>
                <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
                <th className="px-4 py-2.5 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.rut}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEGMENT_COLOR[c.segment] ?? "bg-muted"}`}>
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold">{fmt(c.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

---

### 7. `src/app/admin/productos/page.tsx`
```tsx
"use client";

import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Product = { id: string; name: string; description: string; price: number; category: string; stock: number; active: boolean };
const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Empanadas de pino x6", description: "Empanadas artesanales de carne", price: 5990, category: "Alimentación", stock: 40, active: true },
  { id: "2", name: "Torta de chocolate", description: "Torta 1 kg con cobertura de ganache", price: 18500, category: "Repostería", stock: 8, active: true },
  { id: "3", name: "Pack desayuno", description: "Pan, mermelada, jugo y yogurt", price: 7990, category: "Alimentación", stock: 20, active: false },
  { id: "4", name: "Kuchen de nuez", description: "Kuchen alemán casero 6 porciones", price: 12900, category: "Repostería", stock: 15, active: true },
];
const EMPTY_PRODUCT: Omit<Product, "id"> = { name: "", description: "", price: 0, category: "", stock: 0, active: true };

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  function openAdd() { setEditId(null); setForm(EMPTY_PRODUCT); setShowModal(true); }
  function openEdit(p: Product) { setEditId(p.id); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, stock: p.stock, active: p.active }); setShowModal(true); }
  function saveProduct() {
    if (!form.name.trim()) return;
    if (editId) setProducts((prev) => prev.map((p) => (p.id === editId ? { ...p, ...form } : p)));
    else setProducts((prev) => [...prev, { ...form, id: Math.random().toString(36).slice(2) }]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Productos</h1>
          <p className="mt-1 text-muted-foreground text-sm">Catálogo de productos y precios</p>
        </div>
        <button type="button" onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="size-4" /> Agregar
        </button>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" placeholder="Buscar producto..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-md border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Producto</th>
                <th className="px-4 py-2.5 font-medium">Categoría</th>
                <th className="px-4 py-2.5 font-medium text-right">Precio</th>
                <th className="px-4 py-2.5 font-medium text-right">Stock</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3"><p className="font-medium">{p.name}</p><p className="text-muted-foreground text-xs">{p.description}</p></td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-right font-semibold">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", p.active ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800")}>
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button type="button" onClick={() => openEdit(p)} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"><Edit className="size-4" /></button>
                      <button type="button" onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-sm">{editId ? "Editar producto" : "Nuevo producto"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded p-1 text-muted-foreground hover:bg-accent"><X className="size-4" /></button>
            </div>
            <div className="space-y-4 px-5 py-4">
              {([
                { key: "name", label: "Nombre", type: "text", placeholder: "Nombre del producto" },
                { key: "description", label: "Descripción", type: "text", placeholder: "Descripción breve" },
                { key: "category", label: "Categoría", type: "text", placeholder: "Ej: Alimentación" },
                { key: "price", label: "Precio (CLP)", type: "number", placeholder: "0" },
                { key: "stock", label: "Stock", type: "number", placeholder: "0" },
              ] as const).map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label htmlFor={key} className="mb-1 block text-xs font-medium">{label}</label>
                  <input id={key} type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              ))}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} className="rounded" />
                <span className="text-sm">Producto activo</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <button type="button" onClick={() => setShowModal(false)} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
              <button type="button" onClick={saveProduct} className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 8. `src/app/admin/analytics/page.tsx`
```tsx
"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MONTHLY_DATA = [
  { mes: "Ene", ventas: 2400000, pedidos: 48 },
  { mes: "Feb", ventas: 1800000, pedidos: 36 },
  { mes: "Mar", ventas: 3200000, pedidos: 64 },
  { mes: "Abr", ventas: 2900000, pedidos: 58 },
  { mes: "May", ventas: 3800000, pedidos: 76 },
  { mes: "Jun", ventas: 4200000, pedidos: 84 },
  { mes: "Jul", ventas: 3600000, pedidos: 72 },
  { mes: "Ago", ventas: 4500000, pedidos: 90 },
  { mes: "Sep", ventas: 3900000, pedidos: 78 },
  { mes: "Oct", ventas: 5100000, pedidos: 102 },
  { mes: "Nov", ventas: 6200000, pedidos: 124 },
  { mes: "Dic", ventas: 7800000, pedidos: 156 },
];

const TOP_PRODUCTS = [
  { name: "Torta de chocolate", units: 312, revenue: 5772000 },
  { name: "Empanadas de pino x6", units: 890, revenue: 5330100 },
  { name: "Kuchen de nuez", units: 428, revenue: 5521200 },
  { name: "Pack desayuno", units: 215, revenue: 1718500 },
];

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default function AnalyticsPage() {
  const [metric, setMetric] = useState<"ventas" | "pedidos">("ventas");
  const totalVentas = MONTHLY_DATA.reduce((s, d) => s + d.ventas, 0);
  const totalPedidos = MONTHLY_DATA.reduce((s, d) => s + d.pedidos, 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground text-sm">Métricas de ventas y rendimiento del negocio</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ventas totales", value: fmt(totalVentas) },
          { label: "Pedidos totales", value: totalPedidos.toString() },
          { label: "Ticket promedio", value: fmt(Math.round(totalVentas / totalPedidos)) },
          { label: "Crecimiento anual", value: "+28%" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-sm">Evolución mensual</h2>
          <div className="flex gap-1">
            {(["ventas", "pedidos"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMetric(m)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${metric === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}>
                {m === "ventas" ? "Ventas" : "Pedidos"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={MONTHLY_DATA} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={metric === "ventas" ? (v) => `${(v / 1000000).toFixed(1)}M` : (v) => v.toString()} />
            <Tooltip formatter={(value) => metric === "ventas" ? fmt(Number(value)) : `${value} pedidos`} />
            <Area type="monotone" dataKey={metric} stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-3"><h2 className="font-semibold text-sm">Productos más vendidos</h2></div>
        <div className="divide-y">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 px-5 py-3">
              <span className="w-5 text-center text-muted-foreground text-sm font-medium">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{p.name}</p>
                <p className="text-muted-foreground text-xs">{p.units} unidades</p>
              </div>
              <p className="font-semibold text-sm">{fmt(p.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 9. `src/app/admin/contabilidad/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type F29Row = { mes: string; ventas: number; compras: number; ivaDebito: number; creditoFiscal: number; ppm: number; ivaNeto: number; estado: "declarado" | "pendiente" | "por_vencer" };

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct"];
const MOCK_F29: F29Row[] = MONTHS.map((mes, i) => {
  const ventas = 1_500_000 + i * 200_000;
  const compras = 600_000 + i * 80_000;
  return { mes, ventas, compras, ivaDebito: Math.round(ventas * 0.19), creditoFiscal: Math.round(compras * 0.19), ppm: Math.round(ventas * 0.025), ivaNeto: Math.round(ventas * 0.19) - Math.round(compras * 0.19), estado: i < 8 ? "declarado" : i === 8 ? "pendiente" : "por_vencer" };
});

const ESTADO_STYLE = { declarado: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", pendiente: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", por_vencer: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300" };
const ESTADO_LABEL = { declarado: "Declarado", pendiente: "Pendiente", por_vencer: "Por vencer" };

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
}

export default function ContabilidadPage() {
  const [selected, setSelected] = useState<F29Row | null>(null);
  const totalIva = MOCK_F29.reduce((s, r) => s + r.ivaNeto, 0);
  const totalPpm = MOCK_F29.reduce((s, r) => s + r.ppm, 0);
  const totalVentas = MOCK_F29.reduce((s, r) => s + r.ventas, 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Contabilidad F29 / SII</h1>
        <p className="mt-1 text-muted-foreground text-sm">Declaraciones mensuales de IVA y PPM</p>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ventas totales", value: fmt(totalVentas) },
          { label: "IVA neto pagado", value: fmt(totalIva) },
          { label: "PPM acumulado", value: fmt(totalPpm) },
          { label: "Declaraciones al día", value: `${MOCK_F29.filter((r) => r.estado === "declarado").length} / ${MOCK_F29.length}` },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-3"><h2 className="font-semibold text-sm">Historial F29</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Mes</th>
                  <th className="px-4 py-2.5 font-medium text-right">Ventas</th>
                  <th className="px-4 py-2.5 font-medium text-right">IVA Débito</th>
                  <th className="px-4 py-2.5 font-medium text-right">Crédito Fiscal</th>
                  <th className="px-4 py-2.5 font-medium text-right">PPM</th>
                  <th className="px-4 py-2.5 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MOCK_F29.map((row) => (
                  <tr key={row.mes} onClick={() => setSelected(selected?.mes === row.mes ? null : row)} className={cn("cursor-pointer hover:bg-muted/30", selected?.mes === row.mes && "bg-muted/40")}>
                    <td className="px-4 py-3 font-medium">{row.mes}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.ventas)}</td>
                    <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">{fmt(row.ivaDebito)}</td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{fmt(row.creditoFiscal)}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.ppm)}</td>
                    <td className="px-4 py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ESTADO_STYLE[row.estado])}>{ESTADO_LABEL[row.estado]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-4">
          {selected ? (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-sm mb-3">Detalle {selected.mes}</h3>
              <dl className="space-y-2 text-sm">
                {[["Ventas netas", fmt(selected.ventas)], ["IVA débito (19%)", fmt(selected.ivaDebito)], ["Crédito fiscal", fmt(selected.creditoFiscal)], ["IVA neto a pagar", fmt(selected.ivaNeto)], ["PPM (2.5%)", fmt(selected.ppm)], ["Total a pagar", fmt(selected.ivaNeto + selected.ppm)]].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="rounded-xl border bg-muted/30 p-5 text-center text-muted-foreground text-sm">Selecciona un mes para ver el detalle</div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 10. `src/app/admin/beneficios/page.tsx`
```tsx
"use client";

import { BadgePercent, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Beneficio = { id: string; titulo: string; categoria: "iva" | "renta" | "inversion" | "pyme"; referencia: string; descripcion: string; pasos: string[]; calcular: (v: number, c: number, a: number, p: boolean) => number };

const BENEFICIOS: Beneficio[] = [
  { id: "credito-fiscal", titulo: "Crédito Fiscal IVA", categoria: "iva", referencia: "Art. 23 DL 825", descripcion: "Descuenta el IVA pagado en tus compras del IVA que debes pagar por tus ventas, reduciendo directamente tu deuda mensual con el SII.", pasos: ["Solicita facturas electrónicas de todos tus proveedores", "Registra las facturas en tu libro de compras", "Descuenta el crédito fiscal del débito fiscal en el F29", "Si el crédito supera al débito, queda como remanente"], calcular: (_, c) => Math.round(c * 0.19) },
  { id: "remanente-27bis", titulo: "Remanente IVA Art. 27bis", categoria: "iva", referencia: "Art. 27 bis DL 825", descripcion: "Si tienes remanente de crédito fiscal por 6 meses seguidos, puedes solicitar su devolución anticipada al SII.", pasos: ["Acumula remanente por 6 períodos consecutivos", "Presenta solicitud de devolución en el portal SII", "El SII verifica y aprueba", "Los fondos se depositan en tu cuenta"], calcular: (v, c) => Math.max(0, Math.round((c - v) * 0.19) * 6) },
  { id: "gastos-art31", titulo: "Gastos Tributarios Art. 31", categoria: "renta", referencia: "Art. 31 LIR", descripcion: "Todos los gastos necesarios para producir tu renta son deducibles de la base imponible del impuesto de primera categoría.", pasos: ["Identifica gastos necesarios (arriendos, sueldos, servicios)", "Documenta con facturas y boletas legales", "Registra en libro de compras y gastos", "Descuenta de la renta líquida imponible en el AT"], calcular: (_, c, __, p) => Math.round(c * (p ? 0.25 : 0.27)) },
  { id: "propyme-14ter", titulo: "ProPyme Transparente (Art. 14 Ter)", categoria: "pyme", referencia: "Art. 14 D N°8 LIR", descripcion: "Empresas con ventas hasta UF 75.000 anuales pueden integrar impuesto empresa con impuesto personal, eliminando doble tributación.", pasos: ["Verifica que tus ventas no superen UF 75.000 anuales", "Solicita acogerte al régimen ProPyme en el SII", "Las utilidades tributan a tasa efectiva del propietario", "Presenta la declaración anual con los créditos"], calcular: (v, _, __, p) => (p ? Math.round(v * 0.025) : 0) },
  { id: "art33bis", titulo: "Incentivo Inversión Art. 33 bis", categoria: "inversion", referencia: "Art. 33 bis LIR", descripcion: "Las empresas ProPyme pueden descontar el 6% del valor de activos fijos adquiridos como crédito directo contra el impuesto.", pasos: ["Invierte en activos fijos nuevos (maquinaria, equipos)", "El 6% del valor se descuenta del impuesto a pagar", "Documenta con facturas a nombre de la empresa", "Aplica el crédito en la declaración anual (F22)"], calcular: (_, __, a) => Math.round(a * 0.06) },
  { id: "depreciacion", titulo: "Depreciación Acelerada", categoria: "inversion", referencia: "Art. 31 N°5 bis LIR", descripcion: "Las PyMEs pueden depreciar activos en 1/3 del plazo normal, aumentando el gasto tributario en los primeros años.", pasos: ["Identifica activos fijos y su vida útil normal", "Aplica depreciación acelerada: divide vida útil por 3", "Registra mayor depreciación como gasto contable", "Descuenta el gasto adicional de la renta imponible"], calcular: (_, __, a, p) => Math.round(a * 0.33 * (p ? 0.25 : 0.27)) },
  { id: "boleta-electronica", titulo: "Boleta Electrónica", categoria: "pyme", referencia: "Res. Ex. SII N°74/2017", descripcion: "El uso de boletas electrónicas permite recuperar el 0.75% de las ventas como crédito especial para microempresas.", pasos: ["Activa el sistema de boletas electrónicas en el SII", "Implementa software de facturación electrónica", "Emite todas las boletas electrónicamente", "El crédito del 0.75% se aplica en el F29 mensual"], calcular: (_, c) => Math.round(c * 0.0075) },
  { id: "devolucion-ppm", titulo: "Devolución de PPM", categoria: "renta", referencia: "Art. 97 LIR", descripcion: "Si tu PPM pagado supera el impuesto de primera categoría al cierre del año, tienes derecho a la devolución del excedente.", pasos: ["Calcula el impuesto de primera categoría al 31 dic", "Suma todos los PPM pagados durante el año", "Si PPM > impuesto, la diferencia es devuelta", "Solicita devolución al presentar el F22 en abril"], calcular: (v, _, __, p) => Math.round(v * (p ? 0.025 : 0.05) * 0.25) },
];

const CAT_STYLE: Record<string, string> = { iva: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", renta: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", inversion: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", pyme: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" };
const CAT_LABEL: Record<string, string> = { iva: "IVA", renta: "Renta", inversion: "Inversión", pyme: "PyME" };

function fmt(n: number) { return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n); }
function parseNum(val: string) { return Number(val.replace(/\D/g, "")) || 0; }

export default function BeneficiosPage() {
  const [ventas, setVentas] = useState(1_000_000);
  const [compras, setCompras] = useState(400_000);
  const [activos, setActivos] = useState(0);
  const [propyme, setPropyme] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  const calculados = BENEFICIOS.map((b) => ({ ...b, ahorro: b.calcular(ventas, compras, activos, propyme) })).sort((a, z) => z.ahorro - a.ahorro);
  const totalAhorro = calculados.reduce((s, b) => s + b.ahorro, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <BadgePercent className="size-6 text-emerald-600" /> Beneficios Fiscales & Ahorro Tributario
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">Calcula en tiempo real cuánto puedes ahorrar con los beneficios tributarios disponibles en Chile</p>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Calculadora de ahorro estimado</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ id: "ventas", label: "Ventas mensuales (CLP)", val: ventas, set: setVentas }, { id: "compras", label: "Compras / gastos (CLP)", val: compras, set: setCompras }, { id: "activos", label: "Inversión en activos (CLP)", val: activos, set: setActivos }].map(({ id, label, val, set }) => (
            <div key={id}>
              <label htmlFor={id} className="mb-1 block text-xs font-medium">{label}</label>
              <input id={id} type="text" inputMode="numeric" value={val.toLocaleString("es-CL")} onChange={(e) => set(parseNum(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
          ))}
          <div>
            <p className="mb-1 text-xs font-medium">Régimen tributario</p>
            <div className="flex gap-1">
              {[{ label: "ProPyme", val: true }, { label: "General", val: false }].map(({ label, val }) => (
                <button key={label} type="button" onClick={() => setPropyme(val)} className={cn("flex-1 rounded-md border py-2 text-xs font-medium transition-colors", propyme === val ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent")}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <p className="text-emerald-800 text-xs dark:text-emerald-200">Ahorro total estimado</p>
          <p className="font-bold text-2xl text-emerald-700 dark:text-emerald-300">{fmt(totalAhorro)}</p>
        </div>
      </div>
      <div className="space-y-2">
        {calculados.map((b) => (
          <div key={b.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <button type="button" onClick={() => setExpandido(expandido === b.id ? null : b.id)} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm">{b.titulo}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", CAT_STYLE[b.categoria])}>{CAT_LABEL[b.categoria]}</span>
                  <span className="text-muted-foreground text-xs">{b.referencia}</span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{fmt(b.ahorro)}</p>
                <p className="text-muted-foreground text-xs">ahorro est.</p>
              </div>
              <ChevronDown className={cn("shrink-0 size-4 text-muted-foreground transition-transform duration-200", expandido === b.id ? "rotate-180" : "")} />
            </button>
            {expandido === b.id && (
              <div className="border-t px-5 py-4 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{b.descripcion}</p>
                <ol className="space-y-1.5">
                  {b.pasos.map((paso, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">{i + 1}</span>
                      <span className="text-muted-foreground">{paso}</span>
                    </li>
                  ))}
                </ol>
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                  <p className="text-emerald-800 text-xs dark:text-emerald-200">Ahorro estimado con tus datos: <span className="font-bold text-emerald-700 dark:text-emerald-300">{fmt(b.ahorro)}</span></p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 11. `src/app/admin/cotizaciones/page.tsx`
```tsx
"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Estado = "borrador" | "enviada" | "aceptada" | "facturada";
type Cotizacion = { id: string; numero: string; cliente: string; descripcion: string; monto: number; estado: Estado; fecha: string };

const INITIAL: Cotizacion[] = [
  { id: "1", numero: "COT-001", cliente: "Restaurante La Cima", descripcion: "Sistema de punto de venta", monto: 1200000, estado: "aceptada", fecha: "2024-11-01" },
  { id: "2", numero: "COT-002", cliente: "Clínica Norte", descripcion: "Software de gestión médica", monto: 3500000, estado: "enviada", fecha: "2024-11-08" },
  { id: "3", numero: "COT-003", cliente: "Ferretería López", descripcion: "Inventario y control de stock", monto: 450000, estado: "borrador", fecha: "2024-11-12" },
  { id: "4", numero: "COT-004", cliente: "Hotel Bello", descripcion: "Sistema de reservas y check-in", monto: 2100000, estado: "facturada", fecha: "2024-10-20" },
  { id: "5", numero: "COT-005", cliente: "Farmacia Cruz", descripcion: "Módulo de ventas online", monto: 780000, estado: "enviada", fecha: "2024-11-14" },
];

const NEXT_STATE: Record<Estado, Estado> = { borrador: "enviada", enviada: "aceptada", aceptada: "facturada", facturada: "borrador" };
const ESTADO_STYLE: Record<Estado, string> = { borrador: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", enviada: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", aceptada: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", facturada: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300" };
const TABS: Array<{ key: "all" | Estado; label: string }> = [{ key: "all", label: "Todas" }, { key: "borrador", label: "Borrador" }, { key: "enviada", label: "Enviadas" }, { key: "aceptada", label: "Aceptadas" }, { key: "facturada", label: "Facturadas" }];

function fmt(n: number) { return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n); }

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(INITIAL);
  const [tab, setTab] = useState<"all" | Estado>("all");
  const filtered = tab === "all" ? cotizaciones : cotizaciones.filter((c) => c.estado === tab);
  const montoAceptado = cotizaciones.filter((c) => ["aceptada", "facturada"].includes(c.estado)).reduce((s, c) => s + c.monto, 0);
  const pendientes = cotizaciones.filter((c) => c.estado === "enviada").length;
  const tasa = Math.round((cotizaciones.filter((c) => ["aceptada", "facturada"].includes(c.estado)).length / cotizaciones.length) * 100);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Cotizaciones</h1>
          <p className="mt-1 text-muted-foreground text-sm">Propuestas comerciales y seguimiento de negocios</p>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="size-4" /> Nueva cotización
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: "Monto aceptado", value: fmt(montoAceptado) }, { label: "Enviadas pendientes", value: pendientes.toString() }, { label: "Tasa de conversión", value: `${tasa}%` }].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b px-4 py-2.5">
          {TABS.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)} className={cn("rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors", tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>{t.label}</button>
          ))}
        </div>
        <div className="divide-y">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{c.numero}</p>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", ESTADO_STYLE[c.estado])}>{c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}</span>
                </div>
                <p className="text-muted-foreground text-xs">{c.cliente} — {c.descripcion}</p>
                <p className="mt-0.5 text-muted-foreground text-xs">{c.fecha}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{fmt(c.monto)}</p>
                <button type="button" onClick={() => setCotizaciones((prev) => prev.map((x) => x.id === c.id ? { ...x, estado: NEXT_STATE[x.estado] } : x))} className="mt-1 rounded px-2 py-0.5 text-xs text-primary border border-primary/30 hover:bg-primary/10 transition-colors">Avanzar →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

### 12. `src/app/admin/diseno/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FONTS = ["Inter", "Poppins", "Lato", "Playfair Display", "Roboto"];
const THEMES = [
  { name: "Azul Marino", primary: "#1e40af", accent: "#3b82f6" },
  { name: "Esmeralda", primary: "#065f46", accent: "#10b981" },
  { name: "Violeta", primary: "#5b21b6", accent: "#8b5cf6" },
  { name: "Naranja", primary: "#9a3412", accent: "#f97316" },
  { name: "Rosa", primary: "#9d174d", accent: "#ec4899" },
];
const INITIAL_BRAND = { storeName: "Mi Tienda", tagline: "Calidad y confianza", primaryColor: "#1e40af", accentColor: "#3b82f6", font: "Inter", logoUrl: "" };

export default function DisenoPage() {
  const [brand, setBrand] = useState(INITIAL_BRAND);
  const [saved, setSaved] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Diseño de Tienda</h1>
        <p className="mt-1 text-muted-foreground text-sm">Personaliza la apariencia y marca de tu tienda</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Temas de color</h2>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button key={t.name} type="button" onClick={() => setBrand((b) => ({ ...b, primaryColor: t.primary, accentColor: t.accent }))} className={cn("flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors", brand.primaryColor === t.primary ? "border-primary bg-primary/10 font-semibold" : "hover:border-primary/50 hover:bg-accent")}>
                  <span className="size-4 rounded-full border" style={{ backgroundColor: t.accent }} /> {t.name}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Tipografía</h2>
            <div className="flex flex-wrap gap-2">
              {FONTS.map((font) => (
                <button key={font} type="button" onClick={() => setBrand((b) => ({ ...b, font }))} style={{ fontFamily: font }} className={cn("rounded-lg border px-3 py-1.5 text-sm transition-colors", brand.font === font ? "border-primary bg-primary/10 font-medium text-primary" : "hover:border-primary/50 hover:bg-accent")}>{font}</button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-sm">Identidad de marca</h2>
            <div className="space-y-4">
              {[{ id: "storeName", label: "Nombre de la tienda", key: "storeName" as const }, { id: "tagline", label: "Slogan / Tagline", key: "tagline" as const }, { id: "logoUrl", label: "URL del logo", key: "logoUrl" as const }].map(({ id, label, key }) => (
                <div key={id}>
                  <label htmlFor={id} className="mb-1 block text-xs font-medium">{label}</label>
                  <input id={id} type="text" value={brand[key]} onChange={(e) => setBrand((b) => ({ ...b, [key]: e.target.value }))} className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[{ id: "primaryColor", label: "Color primario", key: "primaryColor" as const }, { id: "accentColor", label: "Color acento", key: "accentColor" as const }].map(({ id, label, key }) => (
                  <div key={id}>
                    <label htmlFor={id} className="mb-1 block text-xs font-medium">{label}</label>
                    <div className="flex items-center gap-2">
                      <input id={id} type="color" value={brand[key]} onChange={(e) => setBrand((b) => ({ ...b, [key]: e.target.value }))} className="size-9 cursor-pointer rounded border p-0.5" />
                      <span className="font-mono text-xs text-muted-foreground">{brand[key]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Vista previa</h2>
            <div className="overflow-hidden rounded-lg border" style={{ fontFamily: brand.font }}>
              <div className="px-4 py-3 text-sm font-bold text-white" style={{ backgroundColor: brand.primaryColor }}>{brand.storeName || "Mi Tienda"}</div>
              <div className="space-y-2 bg-white p-4 dark:bg-gray-900">
                <p className="text-xs text-gray-500">{brand.tagline || "Slogan"}</p>
                <button type="button" className="rounded px-3 py-1.5 text-white text-xs" style={{ backgroundColor: brand.accentColor }}>Ver productos</button>
              </div>
            </div>
          </div>
          <button type="button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className={cn("w-full rounded-lg py-2.5 text-sm font-semibold transition-colors", saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
            {saved ? "✓ Guardado" : "Guardar cambios"}
          </button>
          <button type="button" onClick={() => setBrand(INITIAL_BRAND)} className="w-full rounded-lg border py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">Restaurar por defecto</button>
        </div>
      </div>
    </div>
  );
}
```

---

### 13. `src/app/admin/configuracion/page.tsx`
```tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DIAS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const PAGOS = ["Tarjeta de crédito","Tarjeta de débito","Transferencia bancaria","Mercado Pago","Efectivo"];
type Horario = { activo: boolean; apertura: string; cierre: string };
const INITIAL_HORARIO: Record<string, Horario> = Object.fromEntries(DIAS.map((d, i) => [d, { activo: i < 5, apertura: "09:00", cierre: "18:00" }]));

export default function ConfiguracionPage() {
  const [info, setInfo] = useState({ nombre: "Mi Empresa SpA", rut: "76.123.456-7", giro: "Venta de productos artesanales", email: "contacto@miempresa.cl", telefono: "+56 9 8765 4321", direccion: "Av. Providencia 1234, Santiago" });
  const [slug, setSlug] = useState("mi-empresa");
  const [publica, setPublica] = useState(true);
  const [horario, setHorario] = useState(INITIAL_HORARIO);
  const [pagosActivos, setPagosActivos] = useState<Set<string>>(new Set(["Tarjeta de crédito", "Transferencia bancaria"]));
  const [notifs, setNotifs] = useState({ email: true, sms: false, whatsapp: false });
  const [saved, setSaved] = useState(false);

  function togglePago(pago: string) { setPagosActivos((prev) => { const next = new Set(prev); if (next.has(pago)) next.delete(pago); else next.add(pago); return next; }); }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Configuración</h1>
        <p className="mt-1 text-muted-foreground text-sm">Ajustes generales de tu empresa y tienda</p>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Información de la empresa</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(info) as Array<keyof typeof info>).map((key) => (
            <div key={key} className={key === "direccion" ? "sm:col-span-2" : ""}>
              <label htmlFor={key} className="mb-1 block text-xs font-medium capitalize">{key === "rut" ? "RUT" : key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input id={key} type={key === "email" ? "email" : "text"} value={info[key]} onChange={(e) => setInfo((i) => ({ ...i, [key]: e.target.value }))} className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">URL de tienda</h2>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">tienda.com/</span>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))} className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <label className="mt-3 flex cursor-pointer select-none items-center gap-2">
          <input type="checkbox" checked={publica} onChange={(e) => setPublica(e.target.checked)} className="rounded" />
          <span className="text-sm">Tienda pública (visible para clientes)</span>
        </label>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Horario de atención</h2>
        <div className="space-y-2">
          {DIAS.map((dia) => (
            <div key={dia} className="flex items-center gap-3">
              <label className="flex w-28 cursor-pointer select-none items-center gap-2">
                <input type="checkbox" checked={horario[dia].activo} onChange={(e) => setHorario((prev) => ({ ...prev, [dia]: { ...prev[dia], activo: e.target.checked } }))} className="rounded" />
                <span className="text-sm">{dia}</span>
              </label>
              {horario[dia].activo ? (
                <>
                  <input type="time" value={horario[dia].apertura} onChange={(e) => setHorario((prev) => ({ ...prev, [dia]: { ...prev[dia], apertura: e.target.value } }))} className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary" />
                  <span className="text-muted-foreground text-xs">a</span>
                  <input type="time" value={horario[dia].cierre} onChange={(e) => setHorario((prev) => ({ ...prev, [dia]: { ...prev[dia], cierre: e.target.value } }))} className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </>
              ) : <span className="text-muted-foreground text-xs">Cerrado</span>}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Métodos de pago aceptados</h2>
        <div className="flex flex-wrap gap-2">
          {PAGOS.map((pago) => (
            <button key={pago} type="button" onClick={() => togglePago(pago)} className={cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", pagosActivos.has(pago) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent")}>{pago}</button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Notificaciones</h2>
        <div className="space-y-3">
          {(Object.keys(notifs) as Array<keyof typeof notifs>).map((key) => (
            <label key={key} className="flex cursor-pointer select-none items-center justify-between">
              <span className="text-sm">{key === "email" ? "Correo electrónico" : key === "sms" ? "SMS" : "WhatsApp"}</span>
              <input type="checkbox" checked={notifs[key]} onChange={(e) => setNotifs((n) => ({ ...n, [key]: e.target.checked }))} className="rounded" />
            </label>
          ))}
        </div>
      </div>
      <button type="button" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className={cn("w-full rounded-lg py-2.5 text-sm font-semibold transition-colors", saved ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90")}>
        {saved ? "✓ Configuración guardada" : "Guardar configuración"}
      </button>
    </div>
  );
}
```

---

## NOTAS DE INTEGRACIÓN

1. **Si tu repo ya tiene un `src/app/page.tsx`**, reemplázalo con el de arriba (solo hace redirect a `/admin`).
2. **Si tu admin ya tiene layout propio**, revisa si se puede reemplazar con el `layout.tsx` de arriba o adaptarlo.
3. **El sidebar** usa la clase CSS `--primary` de shadcn/ui. Si tu tema usa nombres distintos, ajusta los `bg-primary`, `text-primary-foreground`, etc.
4. **La página de Analytics** requiere `recharts` — instálalo si no lo tienes: `npm install recharts`
5. **El import `@/lib/utils`** debe exportar la función `cn`. Si en tu proyecto está en otra ruta, actualiza todos los imports.
6. **Los links del sidebar** que apuntan a rutas inexistentes (como `/dashboard/crm`, `/calendar`, `/kanban`) mostrarán 404 hasta que existan esas páginas — eso es esperado.
