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
        <p className="font-medium text-muted-foreground text-sm">Control interno</p>
        <h1 className="mt-2 font-semibold text-3xl tracking-tight">Panel protegido</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Area para revisar acciones internas permitidas, proveedor activo y niveles de permiso.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-muted-foreground text-sm">Rol</p>
          <p className="mt-2 font-semibold text-2xl capitalize">{isMaster ? "superadmin" : "restricted"}</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-muted-foreground text-sm">Provider</p>
          <p className="mt-2 font-semibold text-2xl capitalize">{provider}</p>
        </div>
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-muted-foreground text-sm">Items</p>
          <p className="mt-2 font-semibold text-2xl">{items.length}</p>
        </div>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold text-xl">Opciones de Desarrollador</h2>
            <p className="mt-1 text-muted-foreground text-sm">Comandos seguros y solo visibles con rol superadmin.</p>
          </div>
          <button
            type="button"
            disabled={!isMaster}
            onClick={() => setOpen((value) => !value)}
            className="rounded-xl border px-4 py-2 font-medium text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {open ? "Ocultar opciones" : "Ver opciones"}
          </button>
        </div>

        {!isMaster ? (
          <div className="mt-5 rounded-xl border p-4 text-muted-foreground text-sm">
            Esta zona requiere rol superadmin para mostrar las acciones.
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
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/20">
                    <td className="py-3 pr-4 font-mono text-xs">{item.id}</td>
                    <td className="py-3 pr-4">{item.label}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded bg-muted px-2 py-1 text-xs">{item.level}</span>
                    </td>
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
