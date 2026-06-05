"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];
const PAGOS = [
  "Tarjeta de crédito",
  "Tarjeta de débito",
  "Transferencia bancaria",
  "Mercado Pago",
  "Efectivo",
];

type Horario = { activo: boolean; apertura: string; cierre: string };
const INITIAL_HORARIO: Record<string, Horario> = Object.fromEntries(
  DIAS.map((d, i) => [d, { activo: i < 5, apertura: "09:00", cierre: "18:00" }])
);

export default function ConfiguracionPage() {
  const [info, setInfo] = useState({
    nombre: "Mi Empresa SpA",
    rut: "76.123.456-7",
    giro: "Venta de productos artesanales",
    email: "contacto@miempresa.cl",
    telefono: "+56 9 8765 4321",
    direccion: "Av. Providencia 1234, Santiago",
  });
  const [slug, setSlug] = useState("mi-empresa");
  const [publica, setPublica] = useState(true);
  const [horario, setHorario] = useState(INITIAL_HORARIO);
  const [pagosActivos, setPagosActivos] = useState<Set<string>>(
    new Set(["Tarjeta de crédito", "Transferencia bancaria"])
  );
  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    whatsapp: false,
  });
  const [saved, setSaved] = useState(false);

  function togglePago(pago: string) {
    setPagosActivos((prev) => {
      const next = new Set(prev);
      if (next.has(pago)) next.delete(pago);
      else next.add(pago);
      return next;
    });
  }

  function setHorarioField(
    dia: string,
    field: keyof Horario,
    value: boolean | string
  ) {
    setHorario((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [field]: value },
    }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Configuración</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Ajustes generales de tu empresa y tienda
        </p>
      </div>

      {/* Información empresa */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">
          Información de la empresa
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(info) as Array<keyof typeof info>).map((key) => (
            <div
              key={key}
              className={key === "direccion" ? "sm:col-span-2" : ""}
            >
              <label
                htmlFor={key}
                className="mb-1 block text-xs font-medium capitalize"
              >
                {key === "rut"
                  ? "RUT"
                  : key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                id={key}
                type={key === "email" ? "email" : "text"}
                value={info[key]}
                onChange={(e) =>
                  setInfo((i) => ({ ...i, [key]: e.target.value }))
                }
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tienda pública */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">URL de tienda</h2>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">tienda.com/</span>
          <input
            type="text"
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <label className="mt-3 flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={publica}
            onChange={(e) => setPublica(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">
            Tienda pública (visible para clientes)
          </span>
        </label>
      </div>

      {/* Horario */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Horario de atención</h2>
        <div className="space-y-2">
          {DIAS.map((dia) => (
            <div key={dia} className="flex items-center gap-3">
              <label className="flex w-28 cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={horario[dia].activo}
                  onChange={(e) =>
                    setHorarioField(dia, "activo", e.target.checked)
                  }
                  className="rounded"
                />
                <span className="text-sm">{dia}</span>
              </label>
              {horario[dia].activo && (
                <>
                  <input
                    type="time"
                    value={horario[dia].apertura}
                    onChange={(e) =>
                      setHorarioField(dia, "apertura", e.target.value)
                    }
                    className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="text-muted-foreground text-xs">a</span>
                  <input
                    type="time"
                    value={horario[dia].cierre}
                    onChange={(e) =>
                      setHorarioField(dia, "cierre", e.target.value)
                    }
                    className="rounded-md border bg-background px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </>
              )}
              {!horario[dia].activo && (
                <span className="text-muted-foreground text-xs">Cerrado</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">
          Métodos de pago aceptados
        </h2>
        <div className="flex flex-wrap gap-2">
          {PAGOS.map((pago) => (
            <button
              key={pago}
              type="button"
              onClick={() => togglePago(pago)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                pagosActivos.has(pago)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              )}
            >
              {pago}
            </button>
          ))}
        </div>
      </div>

      {/* Notificaciones */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 font-semibold text-sm">Notificaciones</h2>
        <div className="space-y-3">
          {(Object.keys(notifs) as Array<keyof typeof notifs>).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between select-none"
            >
              <span className="text-sm capitalize">
                {key === "email"
                  ? "Correo electrónico"
                  : key === "sms"
                    ? "SMS"
                    : "WhatsApp"}
              </span>
              <input
                type="checkbox"
                checked={notifs[key]}
                onChange={(e) =>
                  setNotifs((n) => ({ ...n, [key]: e.target.checked }))
                }
                className="rounded"
              />
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        className={cn(
          "w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
          saved
            ? "bg-green-600 text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {saved ? "✓ Configuración guardada" : "Guardar configuración"}
      </button>
    </div>
  );
}
