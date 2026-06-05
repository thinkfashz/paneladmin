"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const IVA_RATE = 0.19;

const PPM_RATES: Record<string, { tasa: number; label: string }> = {
  servicios: { tasa: 0.05, label: "Servicios (PPM 5%)" },
  comercio: { tasa: 0.015, label: "Comercio (PPM 1.5%)" },
  industria: { tasa: 0.02, label: "Industria (PPM 2%)" },
  construccion: { tasa: 0.02, label: "Construcción (PPM 2%)" },
  mineria: { tasa: 0.03, label: "Minería (PPM 3%)" },
  agricultura: { tasa: 0.01, label: "Agricultura (PPM 1%)" },
  profesional: { tasa: 0.1, label: "Prof. Independiente (PPM 10%)" },
};

const fmt = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export function F29Calculator() {
  const [ventasNetas, setVentasNetas] = useState("");
  const [comprasNetas, setComprasNetas] = useState("");
  const [actividad, setActividad] = useState("servicios");
  const [periodo, setPeriodo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const ventas = parseFloat(ventasNetas) || 0;
  const compras = parseFloat(comprasNetas) || 0;
  const ivaDebito = Math.round(ventas * IVA_RATE);
  const ivaCredito = Math.round(compras * IVA_RATE);
  const ivaAPagar = Math.max(0, ivaDebito - ivaCredito);
  const remanente = Math.max(0, ivaCredito - ivaDebito);
  const ppmTasa = PPM_RATES[actividad]?.tasa ?? 0.05;
  const ppmMonto = Math.round(ventas * ppmTasa);
  const totalAPagar = ivaAPagar + ppmMonto;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-xl">Calculadora F29</CardTitle>
          <p className="mt-1 text-muted-foreground text-sm">
            Declaración mensual IVA + PPM · Art. 64 DL 825/1974 · Art. 84 Ley Renta
          </p>
        </div>
        <Badge
          className={totalAPagar > 0 ? "bg-red-500/10 text-red-700 border-red-500/30" : "bg-green-500/10 text-green-700 border-green-500/30"}
          variant="outline"
        >
          {totalAPagar > 0 ? `A pagar: ${fmt(totalAPagar)}` : "Sin pago este período"}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-8 md:grid-cols-2">
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Datos del período</h3>
          <div className="grid gap-2">
            <Label>Período</Label>
            <Input type="month" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Actividad económica</Label>
            <Select value={actividad} onValueChange={setActividad}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PPM_RATES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Ventas netas del período (sin IVA) $</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              value={ventasNetas}
              onChange={(e) => setVentasNetas(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Compras netas del período (sin IVA) $</Label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              value={comprasNetas}
              onChange={(e) => setComprasNetas(e.target.value)}
            />
          </div>
          <div className="rounded-lg border bg-amber-500/5 border-amber-500/20 p-3 text-xs text-amber-700">
            <strong>Recordatorio legal:</strong> El F29 debe declararse hasta el día 12 del mes siguiente al período.
            La no declaración implica multa según Art. 97 N°11 del Código Tributario.
          </div>
        </div>

        {/* Results */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Resumen F29</h3>
          <div className="rounded-xl border bg-muted/10 p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ventas netas</span>
              <span className="font-medium">{fmt(ventas)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA Débito Fiscal (19%)</span>
              <span className="font-medium text-red-600">+ {fmt(ivaDebito)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compras netas</span>
              <span className="font-medium">{fmt(compras)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">IVA Crédito Fiscal (19%)</span>
              <span className="font-medium text-green-600">- {fmt(ivaCredito)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>IVA Neto a pagar</span>
              <span className={ivaAPagar > 0 ? "text-red-600" : "text-green-600"}>{fmt(ivaAPagar)}</span>
            </div>
            {remanente > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Remanente Crédito Fiscal</span>
                <span className="text-green-600 font-medium">{fmt(remanente)} ↗</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">PPM ({(ppmTasa * 100).toFixed(1)}% s/ventas)</span>
              <span className="font-medium text-amber-600">+ {fmt(ppmMonto)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-xl pt-1">
              <span>Total F29</span>
              <span className={totalAPagar > 0 ? "text-red-600" : "text-green-600"}>{fmt(totalAPagar)}</span>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            Cálculo referencial. Consulta con tu contador para declaración oficial.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">Ver detalle</Button>
            <Button className="flex-1">Simular declaración</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
