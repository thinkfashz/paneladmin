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
          <Link
            href="/admin/contabilidad"
            className="underline underline-offset-2"
          >
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
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${mod.color}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary">
                  {mod.label}
                </p>
                <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">
                  {mod.description}
                </p>
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
