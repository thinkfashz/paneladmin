"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BENEFICIOS = [
  {
    id: "14-ter",
    nombre: "Régimen ProPyme / 14 Ter",
    descripcion: "Contabilidad simplificada, tributación sobre flujo efectivo, PPM reducido y exención de algunos gastos rechazados.",
    ley: "Art. 14 D Ley de Renta",
    ahorro: "Hasta 30% menos en impuestos",
    categoria: "PYME",
    requisito: "Ventas ≤ UF 75.000/año",
    progreso: 100,
    desbloqueado: true,
  },
  {
    id: "ppm-reducido",
    nombre: "PPM Reducido Inicio Actividades",
    descripcion: "Los primeros 3 años de actividad pueden declarar PPM al 50% de la tasa normal.",
    ley: "Art. 84 letra e) LIR",
    ahorro: "50% menos en PPM mensual",
    categoria: "PYME",
    requisito: "Empresa con ≤ 3 años de actividad",
    progreso: 100,
    desbloqueado: true,
  },
  {
    id: "sence",
    nombre: "Franquicia SENCE (Capacitación)",
    descripcion: "Deduce hasta el 1% de la planilla anual en gastos de capacitación de trabajadores.",
    ley: "Ley 19.518 SENCE",
    ahorro: "1% planilla anual en impuesto",
    categoria: "Laboral",
    requisito: "Tener trabajadores con contrato",
    progreso: 60,
    desbloqueado: true,
  },
  {
    id: "activo-fijo",
    nombre: "Crédito Activo Fijo (Art. 33 bis)",
    descripcion: "Crédito del 6% sobre el valor de bienes del activo fijo adquiridos durante el año tributario.",
    ley: "Art. 33 bis LIR",
    ahorro: "6% sobre inversión en activos",
    categoria: "Inversión",
    requisito: "Adquirir bienes del activo fijo en el período",
    progreso: 40,
    desbloqueado: false,
  },
  {
    id: "iva-exportador",
    nombre: "Devolución IVA Exportador",
    descripcion: "Recupera el 100% del IVA pagado en compras nacionales destinadas a productos exportados.",
    ley: "Art. 36 DL 825/1974",
    ahorro: "Devolución 100% IVA compras",
    categoria: "Exportación",
    requisito: "Facturar ventas al exterior (exportaciones)",
    progreso: 0,
    desbloqueado: false,
  },
  {
    id: "id",
    nombre: "Crédito I+D (Innovación)",
    descripcion: "Crédito tributario del 35% sobre gastos en proyectos de investigación y desarrollo certificados.",
    ley: "Ley 20.241",
    ahorro: "35% sobre gasto en I+D",
    categoria: "Innovación",
    requisito: "Proyecto I+D certificado por CORFO/ANID",
    progreso: 0,
    desbloqueado: false,
  },
];

const catColor: Record<string, string> = {
  PYME: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  Laboral: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  Inversión: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  Exportación: "bg-green-500/10 text-green-700 border-green-500/20",
  Innovación: "bg-pink-500/10 text-pink-700 border-pink-500/20",
};

export function BeneficiosFiscales() {
  const activos = BENEFICIOS.filter((b) => b.desbloqueado).length;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Beneficios Tributarios Disponibles</CardTitle>
          <Badge variant="outline">{activos}/{BENEFICIOS.length} activos</Badge>
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          Beneficios según tu actividad, ventas y avance en la carpeta tributaria
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 flex-1">
        {BENEFICIOS.map((b) => (
          <div
            key={b.id}
            className={`rounded-xl border p-3 transition-all ${
              b.desbloqueado ? "bg-card" : "opacity-55"
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-base mt-0.5 shrink-0">{b.desbloqueado ? "✅" : "🔒"}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-sm">{b.nombre}</span>
                  <span className={`rounded border px-1.5 py-0.5 text-xs font-medium ${catColor[b.categoria]}`}>
                    {b.categoria}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{b.descripcion}</p>
                <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-green-600">{b.ahorro}</span>
                  <span className="text-primary/50 text-xs">· {b.ley}</span>
                </div>
                {b.progreso > 0 && b.progreso < 100 && (
                  <div className="mt-2">
                    <Progress value={b.progreso} className="h-1.5" />
                    <p className="text-xs text-muted-foreground mt-0.5">{b.progreso}% del requisito cumplido</p>
                  </div>
                )}
                {!b.desbloqueado && b.progreso === 0 && (
                  <p className="text-xs text-amber-600 mt-1">⚠ {b.requisito}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
