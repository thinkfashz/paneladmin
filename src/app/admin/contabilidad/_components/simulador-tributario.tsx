"use client";

import { useState } from "react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Paso {
  id: number;
  titulo: string;
  descripcion: string;
  ley: string;
  accion: string;
  url?: string;
  completado: boolean;
  ahorro?: string;
}

const PASOS_INICIALES: Paso[] = [
  {
    id: 1,
    titulo: "Verificar Inicio de Actividades",
    descripcion: "Confirma que tu RUT esté activo con primera o segunda categoría en SII.cl.",
    ley: "Art. 68 Código Tributario",
    accion: "Verificar en SII",
    url: "https://www.sii.cl",
    completado: true,
  },
  {
    id: 2,
    titulo: "Activar Documentos Electrónicos",
    descripcion: "Habilita boletas y facturas electrónicas. Obligatorio desde 2022 (Res. SII N°45).",
    ley: "Res. Ex. SII N°45/2019",
    accion: "Ir al Portal SII",
    url: "https://www.sii.cl",
    completado: true,
    ahorro: "Evita multas desde $88.000",
  },
  {
    id: 3,
    titulo: "Registrar Ventas del Mes",
    descripcion: "Ingresa todas las facturas y boletas emitidas. El IVA débito se calcula al 19% automáticamente.",
    ley: "Art. 59 DL 825/1974",
    accion: "Usar calculadora F29",
    completado: false,
  },
  {
    id: 4,
    titulo: "Registrar Compras del Mes",
    descripcion: "Registra facturas de proveedores para recuperar el crédito fiscal IVA pagado.",
    ley: "Art. 23 DL 825/1974",
    accion: "Ingresar compras",
    completado: false,
    ahorro: "Recupera hasta 19% de tus compras",
  },
  {
    id: 5,
    titulo: "Calcular y Revisar F29",
    descripcion: "Usa la calculadora para verificar IVA neto y PPM. Optimiza tus compras antes de declarar.",
    ley: "Art. 64 DL 825/1974",
    accion: "Marcar como revisado",
    completado: false,
  },
  {
    id: 6,
    titulo: "Declarar y Pagar antes del día 12",
    descripcion: "Declara en el portal SII. El no pago genera multa del 10% + interés penal mensual.",
    ley: "Art. 97 N°11 Código Tributario",
    accion: "Ir a declarar al SII",
    url: "https://www.sii.cl/servicios_online/1039-.html",
    completado: false,
    ahorro: "Evita multa del 10% + intereses",
  },
];

export function SimuladorTributario() {
  const [pasos, setPasos] = useState<Paso[]>(PASOS_INICIALES);

  const numCompletados = pasos.filter((p) => p.completado).length;
  const progreso = Math.round((numCompletados / pasos.length) * 100);
  const siguienteIdx = pasos.findIndex((p) => !p.completado);

  const toggle = (id: number) => {
    setPasos((prev) => prev.map((p) => (p.id === id ? { ...p, completado: !p.completado } : p)));
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">Simulador Tributario en Tiempo Real</CardTitle>
          <Badge variant={progreso === 100 ? "default" : "secondary"}>
            {progreso === 100 ? "✓ Listo" : `${progreso}%`}
          </Badge>
        </div>
        <Progress value={progreso} className="mt-2 h-2" />
        <p className="mt-1 text-muted-foreground text-xs">
          {numCompletados}/{pasos.length} pasos · Guía mensual de obligaciones SII
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        {pasos.map((paso, idx) => {
          const esActual = idx === siguienteIdx;
          return (
            <div
              key={paso.id}
              className={cn(
                "rounded-xl border p-3 transition-all",
                paso.completado
                  ? "border-green-500/20 bg-green-500/5"
                  : esActual
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-muted/40 bg-muted/5 opacity-60",
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(paso.id)}
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 font-bold text-xs transition-all",
                    paso.completado
                      ? "border-green-500 bg-green-500 text-white"
                      : esActual
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground",
                  )}
                >
                  {paso.completado ? "✓" : idx + 1}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-sm">{paso.titulo}</p>
                    {esActual && !paso.completado && (
                      <Badge variant="outline" className="h-4 py-0 text-xs">
                        Siguiente
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 text-muted-foreground text-xs leading-relaxed">{paso.descripcion}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="text-primary/60 text-xs">📋 {paso.ley}</span>
                    {paso.ahorro && (
                      <span className="font-medium text-green-600 text-xs">💰 {paso.ahorro}</span>
                    )}
                  </div>
                  {esActual && !paso.completado && (
                    <div className="mt-2">
                      {paso.url ? (
                        <Button asChild size="sm" variant="outline" className="h-7 gap-1 text-xs">
                          <Link href={paso.url} target="_blank" rel="noopener noreferrer">
                            {paso.accion} →
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => toggle(paso.id)}
                        >
                          {paso.accion} →
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {progreso === 100 && (
          <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 text-center">
            <p className="font-semibold text-green-700 text-sm">🎉 ¡Obligaciones del mes completadas!</p>
            <p className="mt-1 text-green-600 text-xs">Tu declaración F29 está lista. Recuerda pagar antes del día 12.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
