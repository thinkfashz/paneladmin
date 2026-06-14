"use client";

import { useState } from "react";
import { Save, Store, Clock, CreditCard, Bell, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;
type Dia = (typeof DIAS)[number];

interface HorarioDia {
  activo: boolean;
  apertura: string;
  cierre: string;
}

type Horario = Record<Dia, HorarioDia>;

const HORARIO_INICIAL: Horario = {
  Lunes: { activo: true, apertura: "09:00", cierre: "18:00" },
  Martes: { activo: true, apertura: "09:00", cierre: "18:00" },
  Miércoles: { activo: true, apertura: "09:00", cierre: "18:00" },
  Jueves: { activo: true, apertura: "09:00", cierre: "18:00" },
  Viernes: { activo: true, apertura: "09:00", cierre: "17:00" },
  Sábado: { activo: false, apertura: "10:00", cierre: "14:00" },
  Domingo: { activo: false, apertura: "10:00", cierre: "14:00" },
};

const METODOS_PAGO = [
  { id: "transferencia", label: "Transferencia Bancaria" },
  { id: "tarjeta", label: "Tarjeta de Crédito/Débito" },
  { id: "mercadopago", label: "MercadoPago" },
  { id: "efectivo", label: "Efectivo" },
  { id: "cheque", label: "Cheque" },
];

export function BusinessSettings() {
  const [saved, setSaved] = useState(false);
  const [nombre, setNombre] = useState("Mi Tienda");
  const [rut, setRut] = useState("12.345.678-9");
  const [giro, setGiro] = useState("Comercio al por menor");
  const [email, setEmail] = useState("contacto@mitienda.cl");
  const [telefono, setTelefono] = useState("+56 9 1234 5678");
  const [direccion, setDireccion] = useState("");
  const [storeSlug, setStoreSlug] = useState("mi-tienda");
  const [horario, setHorario] = useState<Horario>(HORARIO_INICIAL);
  const [metodosPago, setMetodosPago] = useState<Set<string>>(new Set(["transferencia", "tarjeta"]));
  const [notifVentas, setNotifVentas] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifCotizaciones, setNotifCotizaciones] = useState(false);
  const [tiendaVisible, setTiendaVisible] = useState(true);

  const toggleDia = (dia: Dia) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], activo: !prev[dia].activo },
    }));
  };

  const updateHorario = (dia: Dia, campo: "apertura" | "cierre", valor: string) => {
    setHorario((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor },
    }));
  };

  const toggleMetodo = (id: string) => {
    setMetodosPago((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
            <p className="mt-1 text-sm text-muted-foreground">Ajusta los datos y preferencias de tu negocio</p>
          </div>
          <Button onClick={handleSave} className={cn(saved && "bg-green-600 hover:bg-green-600")}>
            {saved ? (
              <><Check className="mr-2 h-4 w-4" />Guardado</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Guardar Cambios</>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Información del Negocio */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Información del Negocio</CardTitle>
              </div>
              <CardDescription>Datos tributarios y de contacto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre">Nombre del negocio</Label>
                  <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rut">RUT</Label>
                  <Input id="rut" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-9" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="giro">Giro comercial</Label>
                  <Input id="giro" value={giro} onChange={(e) => setGiro(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email de contacto</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input id="direccion" value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle 123, Ciudad" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tienda Online */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Tienda Online</CardTitle>
              </div>
              <CardDescription>Configuración de tu vitrina pública</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="slug">URL de tu tienda</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">fabrick.cl/</span>
                  <Input
                    id="slug"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Tienda visible al público</p>
                  <p className="text-xs text-muted-foreground">Clientes pueden ver y comprar tus productos</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTiendaVisible((v) => !v)}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                    tiendaVisible ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200",
                      tiendaVisible ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Horario */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Horario de Atención</CardTitle>
              </div>
              <CardDescription>Define los días y horas en que atiendes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {DIAS.map((dia) => (
                  <div key={dia} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleDia(dia)}
                      className={cn(
                        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                        horario[dia].activo ? "bg-primary" : "bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200",
                          horario[dia].activo ? "translate-x-4" : "translate-x-0",
                        )}
                      />
                    </button>
                    <span
                      className={cn(
                        "w-24 text-sm",
                        horario[dia].activo ? "font-medium" : "text-muted-foreground",
                      )}
                    >
                      {dia}
                    </span>
                    {horario[dia].activo ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={horario[dia].apertura}
                          onChange={(e) => updateHorario(dia, "apertura", e.target.value)}
                          className="h-8 w-28 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">–</span>
                        <Input
                          type="time"
                          value={horario[dia].cierre}
                          onChange={(e) => updateHorario(dia, "cierre", e.target.value)}
                          className="h-8 w-28 text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Cerrado</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Métodos de Pago */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Métodos de Pago</CardTitle>
              </div>
              <CardDescription>Selecciona los métodos que aceptas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {METODOS_PAGO.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMetodo(m.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      metodosPago.has(m.id)
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:bg-muted/50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
                        metodosPago.has(m.id) ? "border-primary bg-primary" : "border-muted-foreground/30",
                      )}
                    >
                      {metodosPago.has(m.id) && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className="text-sm font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">Notificaciones</CardTitle>
              </div>
              <CardDescription>Elige qué eventos te notificamos por email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Nueva venta", desc: "Cuando se complete un pago", value: notifVentas, set: setNotifVentas },
                { label: "Stock bajo", desc: "Cuando un producto quede con poco stock", value: notifStock, set: setNotifStock },
                { label: "Nueva cotización aceptada", desc: "Cuando un cliente acepte una cotización", value: notifCotizaciones, set: setNotifCotizaciones },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => item.set((v) => !v)}
                    className={cn(
                      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                      item.value ? "bg-primary" : "bg-muted",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200",
                        item.value ? "translate-x-5" : "translate-x-0",
                      )}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
