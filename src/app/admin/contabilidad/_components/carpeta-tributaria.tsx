"use client";

import { useState } from "react";

import Link from "next/link";

import { CheckCircle2, Circle, ExternalLink, Lock, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ITEMS_CARPETA = [
  { id: "actividades", nombre: "Inicio de Actividades SII", puntos: 20, ley: "Art. 68 CT", inicial: true },
  { id: "docs-electronicos", nombre: "Documentos electrónicos activos", puntos: 15, ley: "Res. SII N°45/2019", inicial: true },
  { id: "f29-6meses", nombre: "F29 últimos 6 meses al día", puntos: 25, ley: "Art. 64 DL 825", inicial: false },
  { id: "libro-vc", nombre: "Libro de Ventas y Compras", puntos: 15, ley: "Art. 59 DL 825", inicial: false },
  { id: "f22", nombre: "F22 último año declarado", puntos: 15, ley: "Art. 65 LIR", inicial: true },
  { id: "rut-activo", nombre: "RUT activo y domicilio vigente", puntos: 10, ley: "Art. 68 CT", inicial: true },
];

const CREDITOS = [
  {
    id: "fogape",
    nombre: "Línea FOGAPE",
    descripcion: "Hasta UF 10.000 con garantía estatal para PYME",
    requiere: 60,
    url: "https://www.fogape.cl",
  },
  {
    id: "bancoestado",
    nombre: "Capital de Trabajo BancoEstado",
    descripcion: "Crédito preferencial PYME hasta $50M",
    requiere: 70,
    url: "https://www.bancoestado.cl",
  },
  {
    id: "corfo",
    nombre: "Financiamiento CORFO Multipropósito",
    descripcion: "Tasa preferencial con subsidio estatal para emprendedores",
    requiere: 80,
    url: "https://www.corfo.cl",
  },
  {
    id: "procredito",
    nombre: "ProCrédito SII – Devolución Acelerada",
    descripcion: "Devolución acelerada de remanente de crédito fiscal IVA",
    requiere: 90,
    url: "https://www.sii.cl",
  },
];

export function CarpetaTributaria() {
  const [completados, setCompletados] = useState<Set<string>>(
    new Set(ITEMS_CARPETA.filter((i) => i.inicial).map((i) => i.id)),
  );

  const toggle = (id: string) => {
    setCompletados((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const puntosObtenidos = ITEMS_CARPETA.filter((i) => completados.has(i.id)).reduce((acc, i) => acc + i.puntos, 0);
  const puntosTotales = ITEMS_CARPETA.reduce((acc, i) => acc + i.puntos, 0);
  const progreso = Math.round((puntosObtenidos / puntosTotales) * 100);
  const creditosDesbloqueados = CREDITOS.filter((c) => progreso >= c.requiere).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Carpeta Tributaria · Acceso a Créditos y Beneficios</CardTitle>
            <p className="mt-1 text-muted-foreground text-sm">
              Marca cada requisito completado. Tu progreso desbloquea créditos FOGAPE, CORFO y beneficios SII en tiempo real.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-primary">
            <TrendingUp className="h-4 w-4" />
            <span className="font-bold text-sm">{creditosDesbloqueados}/{CREDITOS.length}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Barra de progreso */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Progreso carpeta tributaria</span>
            <span className="font-bold text-2xl tabular-nums">{progreso}%</span>
          </div>
          <Progress value={progreso} className="h-4 rounded-full" />
          <p className="text-muted-foreground text-xs">
            {puntosObtenidos}/{puntosTotales} pts · {completados.size}/{ITEMS_CARPETA.length} requisitos · Toca para marcar/desmarcar
          </p>
        </div>

        {/* Items interactivos */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS_CARPETA.map((item) => {
            const done = completados.has(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-left transition-all hover:shadow-sm active:scale-[0.98]",
                  done ? "border-green-500/30 bg-green-500/5" : "border-amber-500/30 bg-amber-500/5",
                )}
              >
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm leading-tight">{item.nombre}</p>
                  <p className="mt-0.5 text-muted-foreground text-xs">{item.ley} · +{item.puntos} pts</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Créditos desbloqueables */}
        <div>
          <h4 className="mb-3 font-semibold text-sm">Créditos y beneficios según tu avance</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {CREDITOS.map((c) => {
              const desbloqueado = progreso >= c.requiere;
              return (
                <div
                  key={c.id}
                  className={cn(
                    "relative rounded-xl border p-4 transition-all",
                    desbloqueado ? "border-primary/30 bg-primary/5 shadow-sm" : "border-muted bg-muted/10",
                  )}
                >
                  {!desbloqueado && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/70 backdrop-blur-[2px]">
                      <div className="text-center">
                        <Lock className="mx-auto h-5 w-5 text-muted-foreground" />
                        <p className="mt-1 text-muted-foreground text-xs">Requiere {c.requiere}%</p>
                      </div>
                    </div>
                  )}
                  <p className="font-semibold text-sm">{c.nombre}</p>
                  <p className="mt-1 text-muted-foreground text-xs leading-relaxed">{c.descripcion}</p>
                  {desbloqueado && (
                    <Button asChild size="sm" className="mt-3 h-7 w-full gap-1.5 text-xs">
                      <Link href={c.url} target="_blank" rel="noopener noreferrer">
                        Solicitar ahora
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
