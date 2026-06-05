"use client";

import { BadgePercent, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Beneficio = {
  id: string;
  titulo: string;
  categoria: "iva" | "renta" | "inversion" | "pyme";
  referencia: string;
  descripcion: string;
  pasos: string[];
  calcular: (v: number, c: number, a: number, propyme: boolean) => number;
};

const BENEFICIOS: Beneficio[] = [
  {
    id: "credito-fiscal",
    titulo: "Crédito Fiscal IVA",
    categoria: "iva",
    referencia: "Art. 23 DL 825",
    descripcion:
      "Puedes descontar el IVA pagado en tus compras y gastos del IVA que debes pagar por tus ventas, reduciendo directamente tu deuda mensual con el SII.",
    pasos: [
      "Solicita facturas electrónicas de todos tus proveedores",
      "Registra las facturas en tu libro de compras",
      "Descuenta el IVA de compras (crédito fiscal) del IVA de ventas (débito fiscal) en el F29",
      "Si el crédito supera al débito, el saldo queda como remanente para el mes siguiente",
    ],
    calcular: (_, c) => Math.round(c * 0.19),
  },
  {
    id: "remanente-27bis",
    titulo: "Remanente IVA Art. 27bis",
    categoria: "iva",
    referencia: "Art. 27 bis DL 825",
    descripcion:
      "Si tienes remanente de crédito fiscal acumulado por 6 meses seguidos, puedes solicitar su devolución anticipada al SII en lugar de esperar a recuperarlo gradualmente.",
    pasos: [
      "Acumula remanente de crédito fiscal por al menos 6 períodos consecutivos",
      "Presenta la solicitud de devolución en el portal del SII",
      "El SII verifica los antecedentes y aprueba la devolución",
      "Los fondos se depositan directamente en tu cuenta bancaria",
    ],
    calcular: (v, c) => Math.max(0, Math.round((c - v) * 0.19) * 6),
  },
  {
    id: "gastos-art31",
    titulo: "Gastos Tributarios Art. 31",
    categoria: "renta",
    referencia: "Art. 31 LIR",
    descripcion:
      "Todos los gastos necesarios para producir tu renta son deducibles de tu base imponible para el impuesto de primera categoría, reduciendo el impuesto a pagar.",
    pasos: [
      "Identifica todos los gastos necesarios para el negocio (arriendos, sueldos, servicios)",
      "Documéntalos con facturas y boletas legales",
      "Registra en el libro de compras y gastos",
      "Descuenta el total de gastos al calcular la renta líquida imponible en el AT",
    ],
    calcular: (_, c, __, propyme) => Math.round(c * (propyme ? 0.25 : 0.27)),
  },
  {
    id: "propyme-14ter",
    titulo: "ProPyme Transparente (Art. 14 Ter)",
    categoria: "pyme",
    referencia: "Art. 14 D N°8 LIR",
    descripcion:
      "Las empresas con ventas hasta UF 75.000 anuales pueden optar al régimen ProPyme que integra impuesto de empresa con impuesto personal, eliminando doble tributación.",
    pasos: [
      "Verifica que tus ventas anuales no superen UF 75.000",
      "Solicita acogerte al régimen ProPyme en el SII (inicio de actividades o enero de cada año)",
      "Las utilidades tributan a tasa efectiva del propietario directamente",
      "Presenta la declaración anual de renta con los créditos correspondientes",
    ],
    calcular: (v, _, __, propyme) => (propyme ? Math.round(v * 0.025) : 0),
  },
  {
    id: "art33bis",
    titulo: "Incentivo Inversión Art. 33 bis",
    categoria: "inversion",
    referencia: "Art. 33 bis LIR",
    descripcion:
      "Las empresas ProPyme pueden descontar el 6% del valor de los activos fijos adquiridos como crédito directo contra el impuesto de primera categoría.",
    pasos: [
      "Invierte en activos fijos nuevos (maquinaria, equipos, vehículos de trabajo)",
      "El 6% del valor de compra se descuenta del impuesto a pagar",
      "Documenta con facturas de compra a nombre de la empresa",
      "Aplica el crédito en la declaración anual de renta (Formulario 22)",
    ],
    calcular: (_, __, a) => Math.round(a * 0.06),
  },
  {
    id: "depreciacion",
    titulo: "Depreciación Acelerada",
    categoria: "inversion",
    referencia: "Art. 31 N°5 bis LIR",
    descripcion:
      "Las PyMEs pueden depreciar sus activos fijos en 1/3 del plazo normal (depreciación acelerada), aumentando el gasto tributario y reduciendo la renta imponible en los primeros años.",
    pasos: [
      "Identifica los activos fijos del negocio y su vida útil normal",
      "Aplica depreciación acelerada: divide la vida útil por 3",
      "Registra la mayor depreciación como gasto en el libro de contabilidad",
      "Descuenta el gasto adicional en el cálculo de la renta líquida imponible",
    ],
    calcular: (_, __, a, propyme) =>
      Math.round(a * 0.33 * (propyme ? 0.25 : 0.27)),
  },
  {
    id: "boleta-electronica",
    titulo: "Boleta Electrónica",
    categoria: "pyme",
    referencia: "Res. Ex. SII N°74/2017",
    descripcion:
      "El uso de boletas electrónicas facilita la auditoría automática y permite recuperar el 0.75% del monto de las ventas como crédito especial para microempresas.",
    pasos: [
      "Activa el sistema de boletas electrónicas en el SII",
      "Implementa el software o aplicación de facturación electrónica",
      "Emite todas las boletas electrónicamente desde el sistema aprobado",
      "El crédito del 0.75% se aplica automáticamente en el F29 mensual",
    ],
    calcular: (_, c) => Math.round(c * 0.0075),
  },
  {
    id: "devolucion-ppm",
    titulo: "Devolución de PPM",
    categoria: "renta",
    referencia: "Art. 97 LIR",
    descripcion:
      "Si al final del año tributario tu PPM pagado supera el impuesto de primera categoría determinado, tienes derecho a la devolución del excedente.",
    pasos: [
      "Calcula el impuesto de primera categoría al 31 de diciembre",
      "Suma todos los PPM pagados durante el año",
      "Si los PPM superan el impuesto, la diferencia es devuelta por el SII",
      "Solicita la devolución al presentar el Formulario 22 en abril del año siguiente",
    ],
    calcular: (v, _, __, propyme) =>
      Math.round(v * (propyme ? 0.025 : 0.05) * 0.25),
  },
];

const CAT_STYLE: Record<string, string> = {
  iva: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  renta:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  inversion:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  pyme: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};
const CAT_LABEL: Record<string, string> = {
  iva: "IVA",
  renta: "Renta",
  inversion: "Inversión",
  pyme: "PyME",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

function parseNum(val: string) {
  return Number(val.replace(/\D/g, "")) || 0;
}

export default function BeneficiosPage() {
  const [ventas, setVentas] = useState(1_000_000);
  const [compras, setCompras] = useState(400_000);
  const [activos, setActivos] = useState(0);
  const [propyme, setPropyme] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);

  const beneficiosCalculados = BENEFICIOS.map((b) => ({
    ...b,
    ahorro: b.calcular(ventas, compras, activos, propyme),
  })).sort((a, z) => z.ahorro - a.ahorro);

  const totalAhorro = beneficiosCalculados.reduce((s, b) => s + b.ahorro, 0);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight">
          <BadgePercent className="size-6 text-emerald-600" />
          Beneficios Fiscales & Ahorro Tributario
        </h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Calcula en tiempo real cuánto puedes ahorrar con los beneficios
          tributarios disponibles en Chile
        </p>
      </div>

      {/* Calculadora */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">
          Calculadora de ahorro estimado
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label htmlFor="ventas" className="mb-1 block text-xs font-medium">
              Ventas mensuales (CLP)
            </label>
            <input
              id="ventas"
              type="text"
              inputMode="numeric"
              value={ventas.toLocaleString("es-CL")}
              onChange={(e) => setVentas(parseNum(e.target.value))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="compras" className="mb-1 block text-xs font-medium">
              Compras / gastos (CLP)
            </label>
            <input
              id="compras"
              type="text"
              inputMode="numeric"
              value={compras.toLocaleString("es-CL")}
              onChange={(e) => setCompras(parseNum(e.target.value))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="activos" className="mb-1 block text-xs font-medium">
              Inversión en activos (CLP)
            </label>
            <input
              id="activos"
              type="text"
              inputMode="numeric"
              value={activos.toLocaleString("es-CL")}
              onChange={(e) => setActivos(parseNum(e.target.value))}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium">Régimen tributario</p>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPropyme(true)}
                className={cn(
                  "flex-1 rounded-md border py-2 text-xs font-medium transition-colors",
                  propyme
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent"
                )}
              >
                ProPyme
              </button>
              <button
                type="button"
                onClick={() => setPropyme(false)}
                className={cn(
                  "flex-1 rounded-md border py-2 text-xs font-medium transition-colors",
                  !propyme
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:bg-accent"
                )}
              >
                General
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/30">
          <p className="text-emerald-800 text-xs dark:text-emerald-200">
            Ahorro total estimado
          </p>
          <p className="font-bold text-2xl text-emerald-700 dark:text-emerald-300">
            {fmt(totalAhorro)}
          </p>
          <p className="mt-0.5 text-emerald-600 text-xs dark:text-emerald-400">
            Combinando todos los beneficios disponibles para tu situación
          </p>
        </div>
      </div>

      {/* Lista de beneficios */}
      <div className="space-y-2">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider px-1">
          Beneficios disponibles
        </h2>
        {beneficiosCalculados.map((b) => (
          <div
            key={b.id}
            className="rounded-xl border bg-card shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setExpandido(expandido === b.id ? null : b.id)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm">{b.titulo}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      CAT_STYLE[b.categoria]
                    )}
                  >
                    {CAT_LABEL[b.categoria]}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {b.referencia}
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  {fmt(b.ahorro)}
                </p>
                <p className="text-muted-foreground text-xs">ahorro est.</p>
              </div>
              <ChevronDown
                className={cn(
                  "shrink-0 size-4 text-muted-foreground transition-transform duration-200",
                  expandido === b.id ? "rotate-180" : ""
                )}
              />
            </button>

            {expandido === b.id && (
              <div className="border-t px-5 py-4 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {b.descripcion}
                </p>
                <div>
                  <p className="font-semibold text-xs mb-2">
                    Pasos para aprovechar este beneficio:
                  </p>
                  <ol className="space-y-1.5">
                    {b.pasos.map((paso, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground">{paso}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/30">
                  <p className="text-emerald-800 text-xs dark:text-emerald-200">
                    Ahorro estimado con tus datos actuales:{" "}
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                      {fmt(b.ahorro)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
