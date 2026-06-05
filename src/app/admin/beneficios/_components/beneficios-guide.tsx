"use client";

import { useState } from "react";

import { BadgePercent, Calculator, ChevronDown, ChevronRight, TrendingDown, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Regimen = "propyme" | "general";
type Categoria = "iva" | "renta" | "inversion" | "pyme";

interface CalcInput {
  ventas: number;
  compras: number;
  activos: number;
  regimen: Regimen;
}

interface Beneficio {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  ley: string;
  calcularAhorro: (input: CalcInput) => number;
  pasos: string[];
  tags: string[];
}

const BENEFICIOS: Beneficio[] = [
  {
    id: "credito-fiscal-iva",
    nombre: "Crédito Fiscal IVA",
    categoria: "iva",
    descripcion:
      "Recupera el 19 % de IVA pagado en TODAS tus compras con factura. Es el beneficio más inmediato: cada factura de insumo, servicio o gasto genera un crédito que se descuenta directamente del IVA que debes pagar por tus ventas.",
    ley: "Art. 23 y 25 DL 825/1974",
    calcularAhorro: ({ compras }) => compras * 0.19,
    pasos: [
      "Exige factura electrónica en TODAS tus compras de insumos, servicios y gastos de operación.",
      "Registra cada factura en tu Libro de Compras electrónico en SII.cl dentro del mes.",
      "En el F29 mensual, el sistema descuenta el crédito fiscal del IVA débito de tus ventas.",
      "Si el crédito supera el débito, el remanente se acumula para meses siguientes sin perderlo.",
    ],
    tags: ["Mensual", "IVA", "Facturas"],
  },
  {
    id: "remanente-iva",
    nombre: "Devolución Remanente IVA (Art. 27 bis)",
    categoria: "iva",
    descripcion:
      "Si tu crédito fiscal IVA supera tu débito por 6 meses consecutivos, puedes solicitar la devolución del remanente acumulado. Aplica especialmente cuando exportas, tienes baja temporada o grandes inversiones en activos.",
    ley: "Art. 27 bis DL 825/1974",
    calcularAhorro: ({ compras, ventas }) => Math.max(0, (compras - ventas) * 0.19) * 6,
    pasos: [
      "Acumula el remanente de crédito fiscal durante 6 meses consecutivos en tu historial F29.",
      "Solicita la devolución en SII.cl → Servicios Online → IVA → Solicitud Art. 27 bis.",
      "El SII emite un certificado de crédito que puedes endosar o solicitar devolución en efectivo.",
      "Ideal si has invertido en activos o si tus compras superan consistentemente tus ventas.",
    ],
    tags: ["Trimestral", "IVA", "Devolución"],
  },
  {
    id: "gasto-tributario",
    nombre: "Gastos Tributarios Deducibles (Art. 31)",
    categoria: "renta",
    descripcion:
      "Deduce de tu renta imponible anual TODOS los gastos necesarios para producir la renta: arriendo, servicios básicos, telefonía, internet, insumos, sueldos, capacitaciones. Reduce directamente cuánto pagas en el F22 anual.",
    ley: "Art. 31 Ley de la Renta (LIR)",
    calcularAhorro: ({ compras, regimen }) => compras * (regimen === "propyme" ? 0.25 : 0.27),
    pasos: [
      "Registra con factura o boleta electrónica todos los gastos del giro: arriendo, servicios, insumos.",
      "Incluye: telefonía, internet, combustible, materiales, capacitaciones, suscripciones de software.",
      "Al cierre del año, estos gastos reducen tu renta líquida imponible en el F22.",
      "Con ProPyme (14 Ter) el beneficio es inmediato: la base imponible se calcula sobre flujo de caja real.",
    ],
    tags: ["Anual", "Renta", "Gastos"],
  },
  {
    id: "propyme-14ter",
    nombre: "Régimen ProPyme 14 Ter",
    categoria: "pyme",
    descripcion:
      "En ProPyme pagas solo el 25 % de impuesto sobre utilidades (vs hasta 35 % en régimen general). Además, tu PPM mensual baja de 5 % a 2.5 %, mejorando tu flujo de caja inmediatamente.",
    ley: "Art. 14 D LIR — Ley 21.210 de 2020",
    calcularAhorro: ({ ventas, regimen }) => ventas * (regimen === "general" ? 0.025 : 0),
    pasos: [
      "Verifica que tus ventas anuales sean inferiores a 75.000 UF (~$2.700 millones).",
      "Inscríbete en régimen ProPyme en SII.cl → Servicios Online → Renta → Cambio de Régimen.",
      "Declara mensualmente F29 con PPM del 2.5 % sobre ventas netas (sin IVA).",
      "Al cierre anual, paga solo 25 % sobre utilidades efectivamente distribuidas.",
    ],
    tags: ["Mensual/Anual", "Renta", "PYME"],
  },
  {
    id: "incentivo-inversion",
    nombre: "Incentivo a la Inversión (Art. 33 bis)",
    categoria: "inversion",
    descripcion:
      "Crédito del 6 % sobre el valor de nuevos activos fijos adquiridos durante el año (computadores, maquinaria, vehículos). Este crédito se descuenta directamente del impuesto de primera categoría a pagar en el F22.",
    ley: "Art. 33 bis LIR — Ley 21.210 de 2020",
    calcularAhorro: ({ activos }) => activos * 0.06,
    pasos: [
      "Compra activos fijos nuevos con factura durante el año comercial (enero–diciembre).",
      "Conserva todas las facturas de compra y actas de recepción del activo.",
      "Registra en el F22 anual en la sección \"Créditos al Impuesto de Primera Categoría\".",
      "Aplica solo para PYME con ventas anuales menores a 100.000 UF (~$3.600 millones).",
    ],
    tags: ["Anual", "Activos", "Crédito Impuesto"],
  },
  {
    id: "depreciacion-acelerada",
    nombre: "Depreciación Acelerada de Activos",
    categoria: "inversion",
    descripcion:
      "Las PYME pueden depreciar activos fijos en 1/3 del tiempo normal. Un computador que normalmente se deprecia en 6 años, en ProPyme se deprecia en 2 años, deduciendo más gasto en los primeros años y pagando menos impuesto.",
    ley: "Art. 31 N°5 bis LIR — Res. Ex. SII N°64/2017",
    calcularAhorro: ({ activos, regimen }) => activos * 0.33 * (regimen === "propyme" ? 0.25 : 0.27),
    pasos: [
      "Identifica todos tus activos fijos: computadores, maquinaria, vehículos, mobiliario.",
      "Aplica el coeficiente 1/3 de la vida útil normal para calcular la depreciación acelerada anual.",
      "Registra la depreciación como gasto tributario en el F22 anual de renta.",
      "Especialmente beneficioso al invertir en equipamiento el primer año de operación.",
    ],
    tags: ["Anual", "Activos", "Depreciación"],
  },
  {
    id: "boleta-electronica",
    nombre: "Crédito por Boleta Electrónica (Personas)",
    categoria: "iva",
    descripcion:
      "Las personas naturales que realizan compras pagadas con tarjeta y respaldadas con boleta electrónica reciben un crédito del 0.75 % que se aplica directamente en el F22 anual, reduciendo el impuesto global complementario.",
    ley: "Art. 110 bis LIR — Modernización Tributaria 2020",
    calcularAhorro: ({ compras }) => compras * 0.0075,
    pasos: [
      "Exige siempre boleta electrónica en tus compras personales (supermercado, farmacia, servicios).",
      "Paga con tarjeta de débito o crédito (no efectivo) para que el beneficio sea registrado automáticamente.",
      "El crédito se aplica automáticamente en tu F22 anual sin trámites adicionales.",
      "Aplica para personas naturales con renta imponible anual.",
    ],
    tags: ["Anual", "Boleta", "Personas"],
  },
  {
    id: "devolucion-ppm",
    nombre: "Devolución de PPM Excedentario (F22)",
    categoria: "renta",
    descripcion:
      "Si los PPM pagados mensualmente durante el año superan tu impuesto de primera categoría definitivo, el SII te devuelve la diferencia automáticamente en el proceso de renta anual de abril.",
    ley: "Art. 93 y 94 LIR",
    calcularAhorro: ({ ventas, regimen }) => ventas * (regimen === "propyme" ? 0.025 : 0.05) * 0.25,
    pasos: [
      "Paga tus PPM mensualmente en el F29 dentro de plazo para evitar recargos.",
      "En abril, al declarar el F22, el sistema calcula tu impuesto de primera categoría definitivo.",
      "Si los PPM pagados superan el impuesto calculado, el SII deposita la diferencia en tu cuenta.",
      "Estrategia: si proyectas menor renta, puedes ajustar el PPM voluntariamente en el F29.",
    ],
    tags: ["Anual", "PPM", "Devolución"],
  },
];

const CATEGORIA_CONFIG: Record<Categoria, { label: string; color: string; bg: string; border: string }> = {
  iva: { label: "IVA", color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  renta: { label: "Renta", color: "text-violet-600", bg: "bg-violet-500/10", border: "border-violet-500/30" },
  inversion: { label: "Inversión", color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  pyme: { label: "PYME", color: "text-green-600", bg: "bg-green-500/10", border: "border-green-500/30" },
};

const ESTRATEGIAS = [
  {
    num: "01",
    titulo: "Exige factura SIEMPRE",
    desc:
      "Cada compra sin factura te hace perder el 19 % de crédito fiscal IVA. Con $400K en compras mensuales = $76.000 recuperados inmediatamente.",
    color: "text-blue-600",
  },
  {
    num: "02",
    titulo: "Ingresa a ProPyme 14 Ter",
    desc:
      "Si tus ventas son < 75.000 UF anuales, tu PPM baja de 5 % a 2.5 % desde el primer mes. Eso es $10.000 menos por cada $400K en ventas.",
    color: "text-green-600",
  },
  {
    num: "03",
    titulo: "Invierte antes del 31 dic.",
    desc:
      "Compra activos fijos antes del 31 de diciembre. Genera 6 % de crédito directo al impuesto + depreciación acelerada que reduce tu renta imponible.",
    color: "text-amber-600",
  },
  {
    num: "04",
    titulo: "Deduce todos tus gastos",
    desc:
      "Arriendo, telefonía, internet, combustible, capacitaciones: cada $1 gastado con factura reduce tu renta en $1, ahorrando $0.25 en impuesto de primera categoría.",
    color: "text-violet-600",
  },
];

const fmt = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const parseInput = (val: string) => {
  const n = Number(val.replace(/[^0-9]/g, ""));
  return Number.isNaN(n) ? 0 : n;
};

export function BeneficiosGuide() {
  const [ventas, setVentas] = useState(1_000_000);
  const [compras, setCompras] = useState(400_000);
  const [activos, setActivos] = useState(0);
  const [regimen, setRegimen] = useState<Regimen>("propyme");
  const [expandido, setExpandido] = useState<string | null>(null);

  const input: CalcInput = { ventas, compras, activos, regimen };

  const ivaDebito = ventas * 0.19;
  const creditoFiscal = compras * 0.19;
  const ivaNeto = Math.max(0, ivaDebito - creditoFiscal);
  const remanente = Math.max(0, creditoFiscal - ivaDebito);
  const ppm = ventas * (regimen === "propyme" ? 0.025 : 0.05);
  const ahorroRealista = creditoFiscal + activos * 0.06 + compras * 0.25 * 0.3;
  const totalObligaciones = ivaDebito + ppm;
  const eficiencia = totalObligaciones > 0 ? Math.min(100, Math.round((ahorroRealista / totalObligaciones) * 100)) : 0;

  const beneficiosOrdenados = BENEFICIOS.map((beneficio) => ({
    ...beneficio,
    ahorro: beneficio.calcularAhorro(input),
  })).sort((x, y) => y.ahorro - x.ahorro);

  return (
    <div className="flex flex-col gap-6">
      {/* Calculadora + Resumen */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Tu situación fiscal mensual</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresa tus cifras y los beneficios se calculan en tiempo real
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ventas">Ventas brutas del mes (con IVA)</Label>
              <Input
                id="ventas"
                value={ventas.toLocaleString("es-CL")}
                onChange={(e) => setVentas(parseInput(e.target.value))}
                placeholder="1.000.000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="compras">Compras y gastos con factura</Label>
              <Input
                id="compras"
                value={compras.toLocaleString("es-CL")}
                onChange={(e) => setCompras(parseInput(e.target.value))}
                placeholder="400.000"
              />
              <p className="text-xs text-muted-foreground">
                Incluye insumos, servicios, arriendo, etc.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="activos">Activos fijos comprados este año</Label>
              <Input
                id="activos"
                value={activos.toLocaleString("es-CL")}
                onChange={(e) => setActivos(parseInput(e.target.value))}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Computadores, maquinaria, vehículos
              </p>
            </div>
            <Separator />
            <div className="space-y-1.5">
              <Label>Régimen tributario</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["propyme", "general"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRegimen(r)}
                    className={cn(
                      "rounded-lg border py-2 text-xs font-medium transition-colors",
                      regimen === r
                        ? "border-primary bg-primary/10 text-primary"
                        : "bg-muted/30 hover:border-primary/40",
                    )}
                  >
                    {r === "propyme" ? "ProPyme 14 Ter" : "General"}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de obligaciones y ahorro */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              <CardTitle className="text-base">Tu resumen tributario del mes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                <p className="text-xs text-muted-foreground">IVA Débito (ventas)</p>
                <p className="text-2xl font-bold tabular-nums text-red-700">{fmt(ivaDebito)}</p>
                <p className="text-xs text-muted-foreground">19 % sobre ventas brutas</p>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-xs text-muted-foreground">Crédito Fiscal IVA</p>
                <p className="text-2xl font-bold tabular-nums text-green-700">{fmt(creditoFiscal)}</p>
                <p className="text-xs text-muted-foreground">19 % de compras con factura</p>
              </div>
              <div
                className={cn(
                  "rounded-xl border p-4",
                  ivaNeto > 0
                    ? "border-red-500/20 bg-red-500/5"
                    : "border-green-500/20 bg-green-500/5",
                )}
              >
                <p className="text-xs text-muted-foreground">IVA Neto a Pagar</p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    ivaNeto > 0 ? "text-red-700" : "text-green-700",
                  )}
                >
                  {fmt(ivaNeto)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {remanente > 0 ? `Remanente: ${fmt(remanente)}` : "Débito − Crédito"}
                </p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs text-muted-foreground">PPM Mensual</p>
                <p className="text-2xl font-bold tabular-nums text-amber-700">{fmt(ppm)}</p>
                <p className="text-xs text-muted-foreground">
                  {regimen === "propyme" ? "2.5 % (ProPyme)" : "5 % (General)"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Ahorro estimado vs no usar beneficios fiscales
              </p>
              <p className="mt-1 text-4xl font-black tabular-nums text-primary">{fmt(ahorroRealista)}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Crédito IVA: {fmt(creditoFiscal)}
                {activos > 0 && ` · Activos 6 %: ${fmt(activos * 0.06)}`}
                {compras > 0 && ` · Gastos deducibles: ${fmt(compras * 0.25 * 0.3)}`}
              </p>
              <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Eficiencia tributaria vs obligaciones brutas</span>
                  <span className="font-semibold text-primary">{eficiencia} %</span>
                </div>
                <Progress value={eficiencia} className="h-2.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de beneficios */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <BadgePercent className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-bold text-lg">Guía de beneficios fiscales aplicables</h2>
            <p className="text-sm text-muted-foreground">
              Ordenados por ahorro estimado con tus datos actuales. Despliega cada uno para ver cómo
              aplicarlo paso a paso.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {beneficiosOrdenados.map((beneficio, idx) => {
            const cfg = CATEGORIA_CONFIG[beneficio.categoria];
            const isOpen = expandido === beneficio.id;
            return (
              <Card
                key={beneficio.id}
                className={cn("overflow-hidden transition-all", beneficio.ahorro === 0 && "opacity-60")}
              >
                <button
                  type="button"
                  onClick={() => setExpandido(isOpen ? null : beneficio.id)}
                  className="flex w-full items-center gap-4 p-4 text-left"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      cfg.bg,
                      cfg.color,
                    )}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-sm">{beneficio.nombre}</p>
                      <Badge variant="outline" className={cn("text-xs", cfg.bg, cfg.color, cfg.border)}>
                        {cfg.label}
                      </Badge>
                      {beneficio.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {beneficio.descripcion}
                    </p>
                  </div>
                  <div className="ml-2 shrink-0 text-right">
                    <p
                      className={cn(
                        "text-lg font-bold tabular-nums",
                        beneficio.ahorro > 0 ? "text-green-600" : "text-muted-foreground",
                      )}
                    >
                      {beneficio.ahorro > 0 ? fmt(beneficio.ahorro) : "Sin datos"}
                    </p>
                    <p className="text-xs text-muted-foreground">ahorro est.</p>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t bg-muted/20 px-4 pb-5 pt-4">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Cómo funciona
                        </p>
                        <p className="text-sm leading-relaxed">{beneficio.descripcion}</p>
                        <div
                          className={cn(
                            "mt-3 inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium",
                            cfg.bg,
                            cfg.color,
                            cfg.border,
                          )}
                        >
                          📋 {beneficio.ley}
                        </div>
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Pasos para aplicarlo
                        </p>
                        <ol className="flex flex-col gap-2">
                          {beneficio.pasos.map((paso, i) => (
                            <li key={paso} className="flex gap-2 text-sm">
                              <span
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                                  cfg.bg,
                                  cfg.color,
                                )}
                              >
                                {i + 1}
                              </span>
                              <span className="text-muted-foreground">{paso}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                    {beneficio.ahorro > 0 && (
                      <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/5 p-3">
                        <p className="text-sm font-semibold text-green-700">
                          💰 Con tus cifras actuales, este beneficio te ahorraría{" "}
                          <span className="font-black">{fmt(beneficio.ahorro)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Estrategias */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Las 4 estrategias de ahorro más efectivas</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Implementa estas 4 acciones y maximiza tu ahorro tributario legal desde el primer mes.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ESTRATEGIAS.map(({ num, titulo, desc, color }) => (
            <div key={num} className="flex flex-col gap-2 rounded-xl border bg-background p-4">
              <span className={cn("text-4xl font-black opacity-20", color)}>{num}</span>
              <p className="font-semibold text-sm">{titulo}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
