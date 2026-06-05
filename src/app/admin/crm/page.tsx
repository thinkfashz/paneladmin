"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_LEADS = [
  {
    id: "1",
    name: "Restaurante La Cima",
    contact: "Pedro Soto",
    value: 1200000,
    stage: "Propuesta",
    prob: 60,
  },
  {
    id: "2",
    name: "Clínica Norte",
    contact: "Ana García",
    value: 3500000,
    stage: "Negociación",
    prob: 80,
  },
  {
    id: "3",
    name: "Ferretería López",
    contact: "Juan López",
    value: 450000,
    stage: "Contacto inicial",
    prob: 20,
  },
  {
    id: "4",
    name: "Hotel Bello",
    contact: "María Silva",
    value: 2100000,
    stage: "Calificación",
    prob: 40,
  },
  {
    id: "5",
    name: "Farmacia Cruz",
    contact: "Diego Muñoz",
    value: 780000,
    stage: "Propuesta",
    prob: 55,
  },
  {
    id: "6",
    name: "Taller Mecánico JM",
    contact: "José Morales",
    value: 320000,
    stage: "Contacto inicial",
    prob: 15,
  },
];

const STAGES = [
  "Todos",
  "Contacto inicial",
  "Calificación",
  "Propuesta",
  "Negociación",
  "Cerrado",
];

const STAGE_COLOR: Record<string, string> = {
  "Contacto inicial":
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Calificación:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Propuesta:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  Negociación:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  Cerrado:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CrmPage() {
  const [filter, setFilter] = useState("Todos");

  const leads =
    filter === "Todos"
      ? MOCK_LEADS
      : MOCK_LEADS.filter((l) => l.stage === filter);
  const totalValue = leads.reduce((s, l) => s + l.value, 0);
  const weightedValue = leads.reduce((s, l) => s + l.value * (l.prob / 100), 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">
          CRM & Pipeline de Ventas
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Seguimiento de oportunidades y leads activos
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Oportunidades", value: MOCK_LEADS.length.toString() },
          { label: "Valor total", value: fmt(totalValue) },
          { label: "Valor ponderado", value: fmt(weightedValue) },
          { label: "Tasa de cierre", value: "38%" },
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
        <div className="flex flex-wrap gap-1.5 border-b px-4 py-3">
          {STAGES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                filter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
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
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  STAGE_COLOR[lead.stage] ?? "bg-muted text-muted-foreground"
                )}
              >
                {lead.stage}
              </span>
              <div className="text-right">
                <p className="font-semibold text-sm">{fmt(lead.value)}</p>
                <p className="text-muted-foreground text-xs">
                  {lead.prob}% prob.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
