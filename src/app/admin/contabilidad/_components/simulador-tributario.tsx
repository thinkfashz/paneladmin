"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PASOS = [
  {
    id: 1,
    titulo: "Verificar Inicio de Actividades",
    descripcion: "Confirma que tu RUT esté activo con segunda categoría o primera categoría en SII.cl.",
    ley: "Art. 68 Código Tributario",
    accion: "Verificar en SII",
    url: "https://www.sii.cl",
    completado: true,
  },
  {
    id: 2,
    titulo: "Activar Documentos Electrónicos",
    descripcion: "Habilita boletas y facturas electrónicas. Es obligatorio desde 2022 (Res. SII N°45).",
    ley: "Res. Ex. SII N°45/2019",
    accion: "Ir al Portal SII",
    url: "https://www.sii.cl",
    completado: true,
  },
  {
    id: 3,
    titulo: "Registrar Ventas del Mes",
    descripcion: "Ingresa todas tus facturas y boletas emitidas. El IVA débito se calcula automáticamente (19%).",
    ley: "Art. 59 DL 825/1974",
    accion: "Ingresar ventas",
    completado: false,
  },
  {
    id: 4,
    titulo: "Registrar Compras del Mes",
    descripcion: "Registra tus facturas de proveedores para recuperar el crédito fiscal IVA pagado.",
    ley: "Art. 23 DL 825/1974",
    accion: "Ingresar compras",
    completado: false,
  },
  {
    id: 5,
    titulo: "Calcular F29 y Revisar",
    descripcion: "Usa la calculadora para verificar IVA neto y PPM. Optimiza tus compras antes de declarar.",
    ley: "Art. 64 DL 825/1974",
    accion: "Ir a calculadora",
    completado: false,
  },
  {
    id: 6,
    titulo: "Declarar y Pagar F29 antes del día 12",
    descripcion: "Declara en el portal SII. El no pago genera multa del 10% + interés penal (Art. 97 N°11).",
    ley: "Art. 97 N°11 Código Tributario",
    accion: "Ir a declarar",
    url: "https://www.sii.cl",
    completado: false,
  },
];

export function SimuladorTributario() {
  const [pasos, setPasos] = useState(PASOS);
  const completados = pasos.filter((p) => p.completado).length;
  const progreso = Math.round((completados / pasos.length) * 100);
  const siguienteIdx = pasos.findIndex((p) => !p.completado);

  const toggle = (id: number) => {
    setPasos((prev) => prev.map((p) => (p.id === id ? { ...p, completado: !p.completado } : p)));
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Simulador Tributario en Tiempo Real</CardTitle>
          <Badge variant={progreso === 100 ? "default" : "secondary"}>
            {progreso === 100 ? "✓ Completo" : `${progreso}%`}
          </Badge>
        </div>
        <Progress value={progreso} className="mt-2 h-2" />
        <p className="text-muted-foreground text-xs mt-1">
          Guía paso a paso para cumplir tus obligaciones tributarias mensuales
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2.5 flex-1">
        {pasos.map((paso, idx) => {
          const esActual = idx === siguienteIdx;
          return (
            <div
              key={paso.id}
              className={`rounded-xl border p-3 transition-all ${
                paso.completado
                  ? "border-green-500/20 bg-green-500/5"
                  : esActual
                    ? "border-primary/40 bg-primary/5 shadow-sm"
                    : "border-muted/40 bg-muted/5 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(paso.id)}
                  className={`mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    paso.completado
                      ? "bg-green-500 border-green-500 text-white"
                      : esActual
                        ? "border-primary text-primary"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {paso.completado ? "✓" : idx + 1}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm">{paso.titulo}</p>
                    {esActual && !paso.completado && (
                      <Badge variant="outline" className="text-xs py-0 h-4">Siguiente</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{paso.descripcion}</p>
                  <p className="text-primary/60 text-xs mt-1">📋 {paso.ley}</p>
                  {esActual && !paso.completado && (
                    <div className="mt-2">
                      {paso.url ? (
                        <a href={paso.url} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            {paso.accion} →
                          </Button>
                        </a>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7 text-xs">
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
            <p className="text-green-700 font-semibold text-sm">🎉 ¡Obligaciones del mes completadas!</p>
            <p className="text-green-600 text-xs mt-1">Tu declaración F29 está lista. Recuerda pagar antes del día 12.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
