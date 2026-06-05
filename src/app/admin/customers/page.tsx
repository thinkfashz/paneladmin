"use client";

import { Search } from "lucide-react";
import { useState } from "react";

const MOCK_CUSTOMERS = [
  {
    id: "1",
    name: "María González",
    email: "maria@gmail.com",
    rut: "12.345.678-9",
    orders: 12,
    total: 4500000,
    segment: "Premium",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    email: "carlos@empresa.cl",
    rut: "9.876.543-2",
    orders: 5,
    total: 980000,
    segment: "Regular",
  },
  {
    id: "3",
    name: "Laura Martínez",
    email: "laura.m@hotmail.com",
    rut: "15.432.109-8",
    orders: 28,
    total: 12100000,
    segment: "VIP",
  },
  {
    id: "4",
    name: "Diego Morales",
    email: "dmorales@yahoo.com",
    rut: "11.223.344-5",
    orders: 3,
    total: 240000,
    segment: "Nuevo",
  },
  {
    id: "5",
    name: "Ana Silva",
    email: "ana.silva@empresa.cl",
    rut: "14.567.890-1",
    orders: 8,
    total: 2340000,
    segment: "Regular",
  },
  {
    id: "6",
    name: "Pedro Soto",
    email: "psoto@gmail.com",
    rut: "8.765.432-1",
    orders: 19,
    total: 7800000,
    segment: "Premium",
  },
];

const SEGMENT_COLOR: Record<string, string> = {
  VIP: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Premium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Regular: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  Nuevo: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const customers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Clientes</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Base de clientes y segmentación
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total clientes", value: MOCK_CUSTOMERS.length.toString() },
          {
            label: "VIP / Premium",
            value: MOCK_CUSTOMERS.filter((c) =>
              ["VIP", "Premium"].includes(c.segment)
            ).length.toString(),
          },
          {
            label: "Pedidos promedio",
            value: Math.round(
              MOCK_CUSTOMERS.reduce((s, c) => s + c.orders, 0) /
                MOCK_CUSTOMERS.length
            ).toString(),
          },
          {
            label: "Valor promedio",
            value: fmt(
              MOCK_CUSTOMERS.reduce((s, c) => s + c.total, 0) /
                MOCK_CUSTOMERS.length
            ),
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <p className="text-muted-foreground text-xs">{kpi.label}</p>
            <p className="mt-1 font-bold text-xl">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border bg-background py-1.5 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Cliente</th>
                <th className="px-4 py-2.5 font-medium">RUT</th>
                <th className="px-4 py-2.5 font-medium">Segmento</th>
                <th className="px-4 py-2.5 font-medium text-right">Pedidos</th>
                <th className="px-4 py-2.5 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-muted-foreground text-xs">{c.email}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.rut}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEGMENT_COLOR[c.segment] ?? "bg-muted"}`}
                    >
                      {c.segment}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {fmt(c.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
