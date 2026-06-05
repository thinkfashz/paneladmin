"use client";

import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  active: boolean;
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Empanadas de pino x6",
    description: "Empanadas artesanales de carne",
    price: 5990,
    category: "Alimentación",
    stock: 40,
    active: true,
  },
  {
    id: "2",
    name: "Torta de chocolate",
    description: "Torta 1 kg con cobertura de ganache",
    price: 18500,
    category: "Repostería",
    stock: 8,
    active: true,
  },
  {
    id: "3",
    name: "Pack desayuno",
    description: "Pan, mermelada, jugo y yogurt",
    price: 7990,
    category: "Alimentación",
    stock: 20,
    active: false,
  },
  {
    id: "4",
    name: "Kuchen de nuez",
    description: "Kuchen alemán casero 6 porciones",
    price: 12900,
    category: "Repostería",
    stock: 15,
    active: true,
  },
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  active: true,
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_PRODUCT);
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      active: p.active,
    });
    setShowModal(true);
  }

  function saveProduct() {
    if (!form.name.trim()) return;
    if (editId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editId ? { ...p, ...form } : p))
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { ...form, id: Math.random().toString(36).slice(2) },
      ]);
    }
    setShowModal(false);
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Productos</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Catálogo de productos y precios
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="size-4" />
          Agregar
        </button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-4 py-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar producto..."
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
                <th className="px-4 py-2.5 font-medium">Producto</th>
                <th className="px-4 py-2.5 font-medium">Categoría</th>
                <th className="px-4 py-2.5 font-medium text-right">Precio</th>
                <th className="px-4 py-2.5 font-medium text-right">Stock</th>
                <th className="px-4 py-2.5 font-medium">Estado</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {p.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {fmt(p.price)}
                  </td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        p.active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800"
                      )}
                    >
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(p.id)}
                        className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-semibold text-sm">
                {editId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4 px-5 py-4">
              {(
                [
                  {
                    key: "name",
                    label: "Nombre",
                    type: "text",
                    placeholder: "Nombre del producto",
                  },
                  {
                    key: "description",
                    label: "Descripción",
                    type: "text",
                    placeholder: "Descripción breve",
                  },
                  {
                    key: "category",
                    label: "Categoría",
                    type: "text",
                    placeholder: "Ej: Alimentación",
                  },
                  {
                    key: "price",
                    label: "Precio (CLP)",
                    type: "number",
                    placeholder: "0",
                  },
                  {
                    key: "stock",
                    label: "Stock",
                    type: "number",
                    placeholder: "0",
                  },
                ] as const
              ).map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label
                    htmlFor={key}
                    className="mb-1 block text-xs font-medium"
                  >
                    {label}
                  </label>
                  <input
                    id={key}
                    type={type}
                    placeholder={placeholder}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        [key]:
                          type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                      }))
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  id="active"
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, active: e.target.checked }))
                  }
                  className="rounded"
                />
                <label htmlFor="active" className="text-sm">
                  Producto activo
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveProduct}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm font-medium hover:bg-primary/90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
