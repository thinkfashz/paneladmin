"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

type F29Row = {
  mes: string;
  ventas: number;
  compras: number;
  ivaDebito: number;
  creditoFiscal: number;
  ppm: number;
  ivaNeto: number;
  estado: "declarado" | "pendiente" | "por_vencer";
};

const MOCK_F29: F29Row[] = MONTHS.slice(0, 10).map((mes, i) => {
  const ventas = 1_500_000 + Math.round(Math.random() * 2_000_000);
  const compras = 600_000 + Math.round(Math.random() * 800_000);
  const ivaDebito = Math.round(ventas * 0.19);
  const creditoFiscal = Math.round(compras * 0.19);
  const ppm = Math.round(ventas * 0.025);
  const ivaNeto = ivaDebito - creditoFiscal;
  return {
    mes,
    ventas,
    compras,
    ivaDebito,
    creditoFiscal,
    ppm,
    ivaNeto,
    estado: i < 8 ? "declarado" : i === 8 ? "pendiente" : "por_vencer",
  };
});

const ESTADO_STYLE = {
  declarado:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  pendiente: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  por_vencer:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
};
const ESTADO_LABEL = {
  declarado: "Declarado",
  pendiente: "Pendiente",
  por_vencer: "Por vencer",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ContabilidadPage() {
  const [selected, setSelected] = useState<F29Row | null>(null);

  const totalIva = MOCK_F29.reduce((s, r) => s + r.ivaNeto, 0);
  const totalPpm = MOCK_F29.reduce((s, r) => s + r.ppm, 0);
  const totalVentas = MOCK_F29.reduce((s, r) => s + r.ventas, 0);

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">
          Contabilidad F29 / SII
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Declaraciones mensuales de IVA y PPM según el SII
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Ventas totales", value: fmt(totalVentas) },
          { label: "IVA neto pagado", value: fmt(totalIva) },
          { label: "PPM acumulado", value: fmt(totalPpm) },
          {
            label: "Declaraciones al día",
            value: `${MOCK_F29.filter((r) => r.estado === "declarado").length} / ${MOCK_F29.length}`,
          },
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-3">
            <h2 className="font-semibold text-sm">Historial F29</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Mes</th>
                  <th className="px-4 py-2.5 font-medium text-right">Ventas</th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    IVA Débito
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    Crédito Fiscal
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">PPM</th>
                  <th className="px-4 py-2.5 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {MOCK_F29.map((row) => (
                  <tr
                    key={row.mes}
                    onClick={() =>
                      setSelected(selected?.mes === row.mes ? null : row)
                    }
                    className={cn(
                      "cursor-pointer hover:bg-muted/30",
                      selected?.mes === row.mes && "bg-muted/40"
                    )}
                  >
                    <td className="px-4 py-3 font-medium">{row.mes}</td>
                    <td className="px-4 py-3 text-right">{fmt(row.ventas)}</td>
                    <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">
                      {fmt(row.ivaDebito)}
                    </td>
                    <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                      {fmt(row.creditoFiscal)}
                    </td>
                    <td className="px-4 py-3 text-right">{fmt(row.ppm)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          ESTADO_STYLE[row.estado]
                        )}
                      >
                        {ESTADO_LABEL[row.estado]}
                      </span>
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
              <h3 className="font-semibold text-sm mb-3">
                Detalle {selected.mes}
              </h3>
              <dl className="space-y-2 text-sm">
                {[
                  ["Ventas netas", fmt(selected.ventas)],
                  ["IVA débito (19%)", fmt(selected.ivaDebito)],
                  ["Crédito fiscal", fmt(selected.creditoFiscal)],
                  ["IVA neto a pagar", fmt(selected.ivaNeto)],
                  ["PPM (2.5%)", fmt(selected.ppm)],
                  ["Total a pagar", fmt(selected.ivaNeto + selected.ppm)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </dl>
            </div>
          ) : (
            <div className="rounded-xl border bg-muted/30 p-5 text-center text-muted-foreground text-sm">
              Selecciona un mes para ver el detalle
            </div>
          )}

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-sm mb-3">Conceptos clave</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <span className="font-semibold text-foreground">
                  IVA Débito
                </span>{" "}
                — 19% sobre tus ventas
              </li>
              <li>
                <span className="font-semibold text-foreground">
                  Crédito Fiscal
                </span>{" "}
                — IVA pagado en compras deducible
              </li>
              <li>
                <span className="font-semibold text-foreground">PPM</span> —
                Pago Provisional Mensual (2.5% para PyME)
              </li>
              <li>
                <span className="font-semibold text-foreground">F29</span> —
                Formulario SII declaración mensual
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
