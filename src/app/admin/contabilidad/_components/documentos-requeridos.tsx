"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DocEstado = "al-dia" | "pendiente" | "no-aplica";

interface Doc {
  id: string;
  nombre: string;
  descripcion: string;
  obligatorio: boolean;
  estado: DocEstado;
  plazo: string;
  ley: string;
}

const DOCS_INICIALES: Doc[] = [
  {
    id: "libro-ventas",
    nombre: "Libro de Ventas (Electrónico)",
    descripcion: "Registro de facturas y boletas electrónicas emitidas del período.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 59 DL 825/1974",
  },
  {
    id: "libro-compras",
    nombre: "Libro de Compras (Electrónico)",
    descripcion: "Registro de facturas de proveedores para acreditar el crédito fiscal IVA.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 23 y 59 DL 825/1974",
  },
  {
    id: "f29",
    nombre: "Declaración F29 (Mensual)",
    descripcion: "Formulario de IVA + PPM. Se declara mensualmente en el portal SII.",
    obligatorio: true,
    estado: "pendiente",
    plazo: "Día 12 de cada mes",
    ley: "Art. 64 DL 825 · Art. 97 N°11 CT",
  },
  {
    id: "f22",
    nombre: "Declaración F22 (Anual)",
    descripcion: "Declaración anual de renta. Incluye ingresos y gastos del año tributario.",
    obligatorio: true,
    estado: "al-dia",
    plazo: "30 de Abril de cada año",
    ley: "Art. 65 Ley de Renta",
  },
  {
    id: "dte",
    nombre: "Boletas y Facturas Electrónicas",
    descripcion: "DTEs emitidos y recibidos. Obligatorio desde 2022. Se gestionan vía SII.",
    obligatorio: true,
    estado: "al-dia",
    plazo: "En tiempo real",
    ley: "Res. Ex. SII N°45/2019",
  },
  {
    id: "ddjj-1945",
    nombre: "DDJJ 1945 – Honorarios Pagados",
    descripcion: "Declaración jurada anual de honorarios pagados a personas naturales.",
    obligatorio: false,
    estado: "pendiente",
    plazo: "15 de Marzo",
    ley: "Art. 101 LIR",
  },
  {
    id: "remuneraciones",
    nombre: "Libro de Remuneraciones",
    descripcion: "Si tienes trabajadores con contrato, debe mantenerse actualizado mensualmente.",
    obligatorio: false,
    estado: "no-aplica",
    plazo: "Mensual",
    ley: "Art. 62 Código del Trabajo",
  },
  {
    id: "f50",
    nombre: "Declaración Jurada F50",
    descripcion: "Para empresas que retienen impuesto a trabajadores independientes. Mensual.",
    obligatorio: false,
    estado: "no-aplica",
    plazo: "Día 12 del mes siguiente",
    ley: "Art. 74 Ley de Renta",
  },
];

const ESTADOS: DocEstado[] = ["al-dia", "pendiente", "no-aplica"];
const ESTADO_LABELS: Record<DocEstado, string> = {
  "al-dia": "Al día ✓",
  pendiente: "Pendiente",
  "no-aplica": "No aplica",
};
const ESTADO_CLASSES: Record<DocEstado, string> = {
  "al-dia": "border-green-500/30 bg-green-500/10 text-green-700",
  pendiente: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  "no-aplica": "",
};

export function DocumentosRequeridos() {
  const [docs, setDocs] = useState<Doc[]>(DOCS_INICIALES);

  const cycleEstado = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        const idx = ESTADOS.indexOf(d.estado);
        return { ...d, estado: ESTADOS[(idx + 1) % ESTADOS.length] as DocEstado };
      }),
    );
  };

  const pendientes = docs.filter((d) => d.estado === "pendiente").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Documentos y Obligaciones Tributarias</CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Guía legal de documentos requeridos por el SII. Toca el estado para actualizarlo.
            </p>
          </div>
          {pendientes > 0 && (
            <Badge variant="outline" className="shrink-0 border-amber-500/30 bg-amber-500/10 text-amber-700">
              {pendientes} pendientes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((doc) => (
            <div key={doc.id} className="flex flex-col gap-2 rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 font-semibold text-sm leading-tight">{doc.nombre}</p>
                <button type="button" onClick={() => cycleEstado(doc.id)} title="Cambiar estado">
                  <Badge
                    variant={doc.estado === "no-aplica" ? "secondary" : "outline"}
                    className={cn("shrink-0 cursor-pointer text-xs transition-colors hover:opacity-80", ESTADO_CLASSES[doc.estado])}
                  >
                    {ESTADO_LABELS[doc.estado]}
                  </Badge>
                </button>
              </div>
              <p className="flex-1 text-muted-foreground text-xs leading-relaxed">{doc.descripcion}</p>
              <div className="flex flex-col gap-1 border-t pt-2">
                <p className="text-xs">
                  <span className="text-muted-foreground">Plazo:</span> {doc.plazo}
                </p>
                <p className="text-primary/50 text-xs">{doc.ley}</p>
                {doc.obligatorio && (
                  <Badge variant="outline" className="mt-1 h-4 w-fit py-0 text-xs">
                    Obligatorio
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
