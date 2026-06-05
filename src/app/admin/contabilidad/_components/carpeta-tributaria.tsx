"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ITEMS_CARPETA = [
  { nombre: "Inicio de Actividades SII", completado: true, puntos: 20, ley: "Art. 68 CT" },
  { nombre: "Documentos electrónicos activos", completado: true, puntos: 15, ley: "Res. SII N°45/2019" },
  { nombre: "F29 últimos 6 meses al día", completado: false, puntos: 25, ley: "Art. 64 DL 825" },
  { nombre: "Libro de Ventas y Compras", completado: false, puntos: 15, ley: "Art. 59 DL 825" },
  { nombre: "F22 último año declarado", completado: true, puntos: 15, ley: "Art. 65 LIR" },
  { nombre: "RUT activo y domicilio vigente", completado: true, puntos: 10, ley: "Art. 68 CT" },
];

const CREDITOS = [
  {
    nombre: "Línea FOGAPE",
    descripcion: "Hasta UF 10.000 con garantía estatal para PYME",
    requiere: 60,
    url: "https://www.fogape.cl",
  },
  {
    nombre: "Capital de Trabajo BancoEstado",
    descripcion: "Crédito preferencial PYME hasta $50M pesos",
    requiere: 70,
    url: "https://www.bancoestado.cl",
  },
  {
    nombre: "Financiamiento CORFO Multipropósito",
    descripcion: "Tasa preferencial con subsidio estatal para emprendedores",
    requiere: 80,
    url: "https://www.corfo.cl",
  },
  {
    nombre: "ProCrédito SII – Devolución Acelerada",
    descripcion: "Devolución acelerada de remanente de crédito fiscal IVA",
    requiere: 90,
    url: "https://www.sii.cl",
  },
];

export function CarpetaTributaria() {
  const completados = ITEMS_CARPETA.filter((i) => i.completado);
  const puntosObtenidos = completados.reduce((acc, i) => acc + i.puntos, 0);
  const puntosTotales = ITEMS_CARPETA.reduce((acc, i) => acc + i.puntos, 0);
  const progreso = Math.round((puntosObtenidos / puntosTotales) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carpeta Tributaria · Acceso a Créditos y Beneficios</CardTitle>
        <p className="text-muted-foreground text-sm">
          Completa tu carpeta tributaria para desbloquear créditos FOGAPE, CORFO y beneficios SII.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Barra de progreso principal */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Progreso carpeta tributaria</span>
            <span className="font-bold text-2xl">{progreso}%</span>
          </div>
          <Progress value={progreso} className="h-5 rounded-full" />
          <p className="text-muted-foreground text-xs">
            {puntosObtenidos}/{puntosTotales} puntos · {completados.length}/{ITEMS_CARPETA.length} requisitos
          </p>
        </div>

        {/* Items de la carpeta */}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS_CARPETA.map((item) => (
            <div
              key={item.nombre}
              className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${
                item.completado
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-amber-500/30 bg-amber-500/5"
              }`}
            >
              <span className="mt-0.5 text-lg">{item.completado ? "✅" : "⏳"}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-tight">{item.nombre}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{item.ley} · +{item.puntos} pts</p>
              </div>
            </div>
          ))}
        </div>

        {/* Créditos desbloqueables */}
        <div>
          <h4 className="mb-3 font-semibold text-sm">Créditos y beneficios según tu progreso</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {CREDITOS.map((c) => {
              const desbloqueado = progreso >= c.requiere;
              return (
                <div
                  key={c.nombre}
                  className={`relative rounded-xl border p-4 transition-all ${
                    desbloqueado
                      ? "border-primary/30 bg-primary/5 shadow-sm"
                      : "border-muted bg-muted/10"
                  }`}
                >
                  {!desbloqueado && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
                      <div className="text-center">
                        <p className="text-2xl">🔒</p>
                        <p className="text-xs text-muted-foreground mt-1">Requiere {c.requiere}%</p>
                      </div>
                    </div>
                  )}
                  <p className="font-semibold text-sm">{c.nombre}</p>
                  <p className="mt-1 text-muted-foreground text-xs">{c.descripcion}</p>
                  {desbloqueado && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="mt-3 h-7 text-xs w-full">Solicitar ahora →</Button>
                    </a>
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
