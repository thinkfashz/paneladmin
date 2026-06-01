# 02 - Plantilla de componente visual

## Archivo destino recomendado

`src/fabrick/system-control/ui.tsx`

## Objetivo

Crear un componente visual con:

- Tarjeta de estado.
- Proveedor activo.
- Rol actual.
- Boton `Ver opciones`.
- Tabla de comandos solo visible si el rol es `superadmin`.

## Codigo base

~~~tsx
"use client";

import { useState } from "react";

type Item = {
  id: string;
  label: string;
  level: string;
};

type Props = {
  role?: string | null;
  provider: string;
  items: readonly Item[];
};

export function SystemControlUI({ role, provider, items }: Props) {
  const [open, setOpen] = useState(false);
  const isMaster = role === "superadmin";
  const visibleItems = isMaster && open ? items : [];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Control interno</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Panel protegido</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Area para revisar acciones internas permitidas, proveedor activo y niveles de permiso.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Rol</p>
          <p className="mt-2 text-2xl font-semibold">{isMaster ? "superadmin" : "restricted"}</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Provider</p>
          <p className="mt-2 text-2xl font-semibold">{provider}</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Items</p>
          <p className="mt-2 text-2xl font-semibold">{items.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Opciones</h2>
            <p className="mt-1 text-sm text-muted-foreground">Solo visibles con rol superadmin.</p>
          </div>
          <button
            type="button"
            disabled={!isMaster}
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {open ? "Ocultar" : "Ver opciones"}
          </button>
        </div>

        {!isMaster ? (
          <div className="mt-5 rounded-xl border p-4 text-sm text-muted-foreground">
            Esta zona requiere rol superadmin.
          </div>
        ) : null}

        {visibleItems.length > 0 ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 pr-4">ID</th>
                  <th className="py-3 pr-4">Nombre</th>
                  <th className="py-3 pr-4">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {visibleItems.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-mono text-xs">{item.id}</td>
                    <td className="py-3 pr-4">{item.label}</td>
                    <td className="py-3 pr-4">{item.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}
~~~
