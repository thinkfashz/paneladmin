import { redirect } from "next/navigation";

import Link from "next/link";

import {
  BarChart3,
  Calculator,
  FileText,
  Package,
  Paintbrush,
  Settings,
  TrendingUp,
  Users,
  ArrowRight,
  Store,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const MODULES = [
  {
    href: "/admin/crm",
    label: "CRM & Agenda",
    description: "Clientes, citas y seguimiento comercial",
    icon: BarChart3,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    status: "activo",
  },
  {
    href: "/admin/customers",
    label: "Clientes",
    description: "Directorio y segmentación de clientes",
    icon: Users,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    status: "activo",
  },
  {
    href: "/admin/productos",
    label: "Productos",
    description: "Catálogo, precios y disponibilidad",
    icon: Package,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    status: "activo",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    description: "Ventas, tráfico y proyecciones",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
    status: "activo",
  },
  {
    href: "/admin/contabilidad",
    label: "Contabilidad / F29",
    description: "SII, declaración F29 y carpeta tributaria",
    icon: Calculator,
    color: "text-red-500",
    bg: "bg-red-500/10",
    status: "activo",
  },
  {
    href: "/admin/cotizaciones",
    label: "Cotizaciones",
    description: "Propuestas, seguimiento y conversiones",
    icon: FileText,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    status: "activo",
  },
  {
    href: "/admin/diseno",
    label: "Diseño",
    description: "Colores, fuentes e identidad de tu tienda",
    icon: Paintbrush,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    status: "activo",
  },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    description: "Datos, horario y métodos de pago",
    icon: Settings,
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
    status: "activo",
  },
] as const;

export default async function AdminHomePage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  const now = new Date();
  const dia = now.getDate();
  const hora = now.getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const mesNombre = now.toLocaleString("es-CL", { month: "long", year: "numeric" });
  const diasF29 = 12 - dia;
  const f29Urgente = dia >= 8 && dia <= 11;
  const f29Vencido = dia > 12;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      {/* Encabezado */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="font-medium text-muted-foreground text-sm">{saludo} 👋</p>
          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">Panel de Administración</h1>
          <p className="mt-1 text-muted-foreground text-sm">Período: <span className="capitalize">{mesNombre}</span></p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          <Store className="h-4 w-4" />
          Ver mi tienda
        </Link>
      </section>

      {/* Alertas rápidas */}
      {(f29Urgente || f29Vencido) && (
        <Link href="/admin/contabilidad">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/30",
              f29Vencido
                ? "border-red-500/30 bg-red-500/5"
                : "border-amber-500/30 bg-amber-500/5",
            )}
          >
            <AlertCircle
              className={cn(
                "h-5 w-5 shrink-0",
                f29Vencido ? "text-red-500" : "text-amber-500",
              )}
            />
            <p
              className={cn(
                "text-sm font-semibold",
                f29Vencido ? "text-red-700" : "text-amber-700",
              )}
            >
              {f29Vencido
                ? "F29 vencido — Declara ahora para evitar multa"
                : `F29: quedan ${diasF29} día${diasF29 === 1 ? "" : "s"} — Ir al módulo contable`}
            </p>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      )}

      {!f29Urgente && !f29Vencido && (
        <div className="flex items-center gap-3 rounded-xl border border-green-500/30 bg-green-500/5 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <p className="text-sm font-semibold text-green-700">
            {dia <= 12
              ? `F29 al día — vence el día 12 (quedan ${diasF29} días)`
              : "F29 declarado este período ✓"}
          </p>
        </div>
      )}

      {/* Módulos */}
      <div>
        <h2 className="mb-3 font-semibold text-lg">Módulos</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(({ href, label, description, icon: Icon, color, bg }) => (
            <Link key={href} href={href}>
              <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", bg)}>
                      <Icon className={cn("h-5 w-5", color)} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Activo
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="mt-0.5 text-muted-foreground text-xs">{description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    Abrir <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
