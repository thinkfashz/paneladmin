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
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function AnalyticsPage() {
  const [metric, setMetric] = useState<"ventas" | "pedidos">("ventas");

  const totalVentas = MONTHLY_DATA.reduce((s, d) => s + d.ventas, 0);
  const totalPedidos = MONTHLY_DATA.reduce((s, d) => s + d.pedidos, 0);
  const avgTicket = Math.round(totalVentas / totalPedidos);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Métricas de ventas y rendimiento del negocio
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ventas totales", value: fmt(totalVentas) },
          { label: "Pedidos totales", value: totalPedidos.toString() },
          { label: "Ticket promedio", value: fmt(avgTicket) },
          { label: "Crecimiento anual", value: "+28%" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
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
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  metric === m
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {m === "ventas" ? "Ventas" : "Pedidos"}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart
            data={MONTHLY_DATA}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 11 }}
              className="text-muted-foreground"
              tickFormatter={
                metric === "ventas"
                  ? (v) => `${(v / 1000000).toFixed(1)}M`
                  : (v) => v.toString()
              }
            />
            <Tooltip
              formatter={(value) =>
                metric === "ventas" ? fmt(Number(value)) : `${value} pedidos`
              }
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary) / 0.15)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="font-semibold text-sm">Productos más vendidos</h2>
        </div>
        <div className="divide-y">
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} className="flex items-center gap-4 px-5 py-3">
              <span className="w-5 text-center text-muted-foreground text-sm font-medium">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{p.name}</p>
                <p className="text-muted-foreground text-xs">
                  {p.units} unidades
                </p>
              </div>
              <p className="font-semibold text-sm">{fmt(p.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
