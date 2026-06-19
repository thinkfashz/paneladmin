"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EstadoCotizacion = "borrador" | "enviada" | "aceptada" | "rechazada" | "facturada";

interface Cotizacion {
  id: string;
  numero: string;
  cliente: string;
  email: string;
  monto: number;
  estado: EstadoCotizacion;
  fechaEmision: string;
  fechaVencimiento: string;
  items: number;
}

const MOCK_COTIZACIONES: Cotizacion[] = [
  {
    id: "1",
    numero: "COT-2024-001",
    cliente: "Empresa ABC Ltda.",
    email: "compras@abc.cl",
    monto: 850000,
    estado: "aceptada",
    fechaEmision: "2024-01-10",
    fechaVencimiento: "2024-01-25",
    items: 5,
  },
  {
    id: "2",
    numero: "COT-2024-002",
    cliente: "Comercial XYZ SpA",
    email: "admin@xyz.cl",
    monto: 320000,
    estado: "enviada",
    fechaEmision: "2024-01-12",
    fechaVencimiento: "2024-01-27",
    items: 3,
  },
  {
    id: "3",
    numero: "COT-2024-003",
    cliente: "Juan Pérez",
    email: "jperez@gmail.com",
    monto: 95000,
    estado: "borrador",
    fechaEmision: "2024-01-14",
    fechaVencimiento: "2024-01-29",
    items: 2,
  },
  {
    id: "4",
    numero: "COT-2024-004",
    cliente: "Servicios Sur Ltda.",
    email: "info@sur.cl",
    monto: 1250000,
    estado: "rechazada",
    fechaEmision: "2024-01-08",
    fechaVencimiento: "2024-01-23",
    items: 8,
  },
  {
    id: "5",
    numero: "COT-2024-005",
    cliente: "Tech Solutions S.A.",
    email: "ventas@tech.cl",
    monto: 2100000,
    estado: "facturada",
    fechaEmision: "2024-01-05",
    fechaVencimiento: "2024-01-20",
    items: 12,
  },
  {
    id: "6",
    numero: "COT-2024-006",
    cliente: "Distribuidora Norte",
    email: "pedidos@norte.cl",
    monto: 440000,
    estado: "enviada",
    fechaEmision: "2024-01-15",
    fechaVencimiento: "2024-01-30",
    items: 4,
  },
];

const ESTADO_CICLO: Record<EstadoCotizacion, EstadoCotizacion> = {
  borrador: "enviada",
  enviada: "aceptada",
  aceptada: "facturada",
  rechazada: "borrador",
  facturada: "borrador",
};

const ESTADO_CONFIG: Record<
  EstadoCotizacion,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  borrador: { label: "Borrador", className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-600", icon: Clock },
  enviada: { label: "Enviada", className: "border-blue-500/30 bg-blue-500/10 text-blue-700", icon: Send },
  aceptada: { label: "Aceptada", className: "border-green-500/30 bg-green-500/10 text-green-700", icon: CheckCircle2 },
  rechazada: { label: "Rechazada", className: "border-red-500/30 bg-red-500/10 text-red-700", icon: XCircle },
  facturada: { label: "Facturada", className: "border-purple-500/30 bg-purple-500/10 text-purple-700", icon: Receipt },
};

const FILTROS: Array<{ value: EstadoCotizacion | "todas"; label: string }> = [
  { value: "todas", label: "Todas" },
  { value: "borrador", label: "Borrador" },
  { value: "enviada", label: "Enviadas" },
  { value: "aceptada", label: "Aceptadas" },
  { value: "rechazada", label: "Rechazadas" },
  { value: "facturada", label: "Facturadas" },
];

function formatCLP(amount: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(amount);
}

export function QuoteList() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>(MOCK_COTIZACIONES);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState<EstadoCotizacion | "todas">("todas");

  const avanzarEstado = (id: string) => {
    setCotizaciones((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, estado: ESTADO_CICLO[c.estado] } : c,
      ),
    );
  };

  const filtradas = cotizaciones.filter((c) => {
    const matchSearch =
      c.cliente.toLowerCase().includes(search.toLowerCase()) ||
      c.numero.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === "todas" || c.estado === filtro;
    return matchSearch && matchFiltro;
  });

  const totalAceptadas = cotizaciones.filter((c) => c.estado === "aceptada").reduce((s, c) => s + c.monto, 0);
  const totalEnviadas = cotizaciones.filter((c) => c.estado === "enviada").length;
  const tasaConversion = Math.round(
    (cotizaciones.filter((c) => c.estado === "aceptada" || c.estado === "facturada").length /
      cotizaciones.filter((c) => c.estado !== "borrador").length) *
      100,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cotizaciones</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestiona y da seguimiento a tus propuestas comerciales
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Cotización
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monto Aceptado</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">{formatCLP(totalAceptadas)}</p>
              <p className="mt-1 text-xs text-muted-foreground">En cotizaciones aceptadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes de Respuesta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalEnviadas}</p>
              <p className="mt-1 text-xs text-muted-foreground">Cotizaciones enviadas sin respuesta</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tasa de Conversión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{tasaConversion}%</p>
              <p className="mt-1 text-xs text-muted-foreground">Aceptadas sobre enviadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por cliente o número..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-1">
                {FILTROS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFiltro(f.value)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      filtro === f.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtradas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm font-medium">No hay cotizaciones</p>
                <p className="mt-1 text-xs text-muted-foreground">Prueba con otro filtro o crea una nueva</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                      <th className="px-4 py-3">Número</th>
                      <th className="px-4 py-3">Cliente</th>
                      <th className="px-4 py-3 text-right">Monto</th>
                      <th className="px-4 py-3 text-center">Ítems</th>
                      <th className="px-4 py-3">Vencimiento</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((c) => {
                      const cfg = ESTADO_CONFIG[c.estado];
                      const Icon = cfg.icon;
                      return (
                        <tr key={c.id} className="border-b transition-colors hover:bg-muted/20">
                          <td className="px-4 py-3 font-mono text-xs font-semibold">{c.numero}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium">{c.cliente}</div>
                            <div className="text-xs text-muted-foreground">{c.email}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">{formatCLP(c.monto)}</td>
                          <td className="px-4 py-3 text-center text-muted-foreground">{c.items}</td>
                          <td className="px-4 py-3 text-muted-foreground">{c.fechaVencimiento}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className={cn("gap-1", cfg.className)}>
                              <Icon className="h-3 w-3" />
                              {cfg.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs"
                                onClick={() => avanzarEstado(c.id)}
                              >
                                Avanzar
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                                Ver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
