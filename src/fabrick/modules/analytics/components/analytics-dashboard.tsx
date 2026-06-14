"use client";

import { BarChart3, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const MONTHLY = [
  { mes: "Ene", ventas: 1200000, gastos: 780000 },
  { mes: "Feb", ventas: 980000, gastos: 620000 },
  { mes: "Mar", ventas: 1450000, gastos: 890000 },
  { mes: "Abr", ventas: 1680000, gastos: 1020000 },
  { mes: "May", ventas: 2100000, gastos: 1150000 },
  { mes: "Jun", ventas: 1890000, gastos: 980000 },
];

const TOP_PRODUCTS = [
  { nombre: "Servicio Premium", ventas: 45, pct: 90 },
  { nombre: "Consultoría Básica", ventas: 38, pct: 76 },
  { nombre: "Producto A", ventas: 29, pct: 58 },
  { nombre: "Pack Mensual", ventas: 22, pct: 44 },
  { nombre: "Asesoría Express", ventas: 17, pct: 34 },
];

const RESUMEN = [
  { label: "Ventas brutas 6 meses", value: "$9.300.000" },
  { label: "Gastos totales", value: "$5.440.000" },
  { label: "Margen bruto estimado", value: "41.5%" },
  { label: "IVA Débito estimado (19%)", value: "$1.767.000" },
  { label: "PPM estimado (5%)", value: "$465.000" },
  { label: "F29 total estimado", value: "$2.232.000" },
];

const KPIS = [
  { label: "Ventas del mes", value: "$1.890.000", change: "+12%", up: true, icon: ShoppingCart },
  { label: "Clientes nuevos", value: "24", change: "+3 vs anterior", up: true, icon: Users },
  { label: "Ticket promedio", value: "$78.750", change: "−5%", up: false, icon: TrendingUp },
  { label: "Conversión tienda", value: "6.4%", change: "+0.8pp", up: true, icon: BarChart3 },
];

const fmt = (v: number) =>
  v.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

function TooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border bg-background p-3 shadow-lg">
      <p className="mb-1.5 font-semibold text-sm">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map(({ label, value, change, up, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className="font-bold text-2xl tabular-nums">{value}</p>
                  <p className={cn("font-medium text-xs", up ? "text-green-600" : "text-red-500")}>
                    {up ? "↑" : "↓"} {change}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ventas y gastos — últimos 6 meses</CardTitle>
          <p className="text-muted-foreground text-xs">
            Datos demostrativos. Conecta tu banco o SII para datos reales en tiempo real.
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={MONTHLY} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <defs>
                <linearGradient id="gVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(99,102,241)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="rgb(99,102,241)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gGastos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgb(244,63,94)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="rgb(244,63,94)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(228,228,231)" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11 }} />
              <Tooltip content={<TooltipContent />} />
              <Area
                type="monotone"
                dataKey="ventas"
                name="Ventas"
                stroke="rgb(99,102,241)"
                fill="url(#gVentas)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="gastos"
                name="Gastos"
                stroke="rgb(244,63,94)"
                fill="url(#gGastos)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top productos + resumen */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Productos / servicios más vendidos</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {TOP_PRODUCTS.map((item) => (
              <div key={item.nombre} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.nombre}</span>
                  <span className="tabular-nums text-muted-foreground">{item.ventas} ventas</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen del semestre</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-0">
            {RESUMEN.map(({ label, value }) => (
              <div key={label}>
                <div className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-semibold tabular-nums">{value}</span>
                </div>
                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
