"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Estado = "borrador" | "enviada" | "aceptada" | "facturada";

type Cotizacion = {
  id: string;
  numero: string;
  cliente: string;
  descripcion: string;
  monto: number;
  estado: Estado;
  fecha: string;
};

const INITIAL: Cotizacion[] = [
  {
    id: "1",
    numero: "COT-001",
    cliente: "Restaurante La Cima",
    descripcion: "Sistema de punto de venta",
    monto: 1200000,
    estado: "aceptada",
    fecha: "2024-11-01",
  },
  {
    id: "2",
    numero: "COT-002",
    cliente: "Clínica Norte",
    descripcion: "Software de gestión médica",
    monto: 3500000,
    estado: "enviada",
    fecha: "2024-11-08",
  },
  {
    id: "3",
    numero: "COT-003",
    cliente: "Ferretería López",
    descripcion: "Inventario y control de stock",
    monto: 450000,
    estado: "borrador",
    fecha: "2024-11-12",
  },
  {
    id: "4",
    numero: "COT-004",
    cliente: "Hotel Bello",
    descripcion: "Sistema de reservas y check-in",
    monto: 2100000,
    estado: "facturada",
    fecha: "2024-10-20",
  },
  {
    id: "5",
    numero: "COT-005",
    cliente: "Farmacia Cruz",
    descripcion: "Módulo de ventas online",
    monto: 780000,
    estado: "enviada",
    fecha: "2024-11-14",
  },
];

const NEXT_STATE: Record<Estado, Estado> = {
  borrador: "enviada",
  enviada: "aceptada",
  aceptada: "facturada",
  facturada: "borrador",
};

const ESTADO_STYLE: Record<Estado, string> = {
  borrador: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  enviada: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  aceptada:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  facturada:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const TABS: Array<{ key: "all" | Estado; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "borrador", label: "Borrador" },
  { key: "enviada", label: "Enviadas" },
  { key: "aceptada", label: "Aceptadas" },
  { key: "facturada", label: "Facturadas" },
];

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(INITIAL);
  const [tab, setTab] = useState<"all" | Estado>("all");

  const filtered =
    tab === "all" ? cotizaciones : cotizaciones.filter((c) => c.estado === tab);

  const montoAceptado = cotizaciones
    .filter((c) => ["aceptada", "facturada"].includes(c.estado))
    .reduce((s, c) => s + c.monto, 0);
  const pendientes = cotizaciones.filter((c) => c.estado === "enviada").length;
  const tasa = Math.round(
    (cotizaciones.filter((c) => ["aceptada", "facturada"].includes(c.estado))
      .length /
      cotizaciones.length) *
      100
  );

  function avanzar(id: string) {
    setCotizaciones((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, estado: NEXT_STATE[c.estado] } : c
      )
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Cotizaciones</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Propuestas comerciales y seguimiento de negocios
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Nueva cotización
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Monto aceptado", value: fmt(montoAceptado) },
          { label: "Enviadas pendientes", value: pendientes.toString() },
          { label: "Tasa de conversión", value: `${tasa}%` },
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

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex gap-1 overflow-x-auto border-b px-4 py-2.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="divide-y">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{c.numero}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      ESTADO_STYLE[c.estado]
                    )}
                  >
                    {c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {c.cliente} — {c.descripcion}
                </p>
                <p className="mt-0.5 text-muted-foreground text-xs">
                  {c.fecha}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{fmt(c.monto)}</p>
                <button
                  type="button"
                  onClick={() => avanzar(c.id)}
                  className="mt-1 rounded px-2 py-0.5 text-xs text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
                >
                  Avanzar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
