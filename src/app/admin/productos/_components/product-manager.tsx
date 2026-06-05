"use client";

import { useState } from "react";
import {
  Edit2,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/fabrick/store/types";
import { cn } from "@/lib/utils";

type ProductManagerProps = { products: Product[] };

const fmt = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

const emptyForm = () => ({
  name: "",
  description: "",
  price: "",
  category: "",
  image_url: "",
  is_active: true,
});

export function ProductManager({ products: initial }: ProductManagerProps) {
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const categories = ["all", ...Array.from(new Set(products.flatMap((p) => (p.category ? [p.category] : []))))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchSearch && (filterCat === "all" || p.category === filterCat);
  });

  const toggleActive = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));

  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm());
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      category: p.category ?? "",
      image_url: p.image_url ?? "",
      is_active: p.is_active,
    });
    setShowModal(true);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !form.price) return;
    const price = Number(form.price.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(price) || price < 0) return;

    if (editId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? {
                ...p,
                name: form.name.trim(),
                description: form.description || null,
                price,
                category: form.category || null,
                image_url: form.image_url || null,
                is_active: form.is_active,
              }
            : p,
        ),
      );
    } else {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        business_id: "",
        name: form.name.trim(),
        description: form.description || null,
        price,
        category: form.category || null,
        image_url: form.image_url || null,
        is_active: form.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar producto…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCat(cat)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  filterCat === cat
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "bg-muted/30 hover:border-primary/40",
                )}
              >
                {cat === "all" ? "Todos" : cat}
              </button>
            ))}
          </div>
          <Button onClick={openAdd} className="ml-auto gap-2">
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
        </div>

        <p className="text-muted-foreground text-sm">
          {filtered.length} productos · 
          <span className="text-green-600">{products.filter((p) => p.is_active).length} activos</span>
          {" "}· {products.filter((p) => !p.is_active).length} inactivos
        </p>

        {initial.length === 0 && products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
              <h3 className="font-semibold text-lg">Sin productos</h3>
              <p className="mt-1 max-w-sm text-muted-foreground text-sm">
                Agrega tu primer producto para que aparezca en tu tienda pública.
              </p>
              <Button onClick={openAdd} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Agregar primer producto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Productos ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="p-4 text-left font-medium">Producto</th>
                      <th className="p-4 text-left font-medium">Categoría</th>
                      <th className="p-4 text-right font-medium">Precio</th>
                      <th className="p-4 text-center font-medium">Estado</th>
                      <th className="p-4 text-center font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y bg-background">
                    {filtered.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {p.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50">
                                <Package className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium leading-tight">{p.name}</p>
                              {p.description && (
                                <p className="line-clamp-1 text-muted-foreground text-xs">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {p.category ? (
                            <Badge variant="outline" className="text-xs">{p.category}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-semibold tabular-nums">{fmt(p.price)}</td>
                        <td className="p-4 text-center">
                          <button type="button" onClick={() => toggleActive(p.id)}>
                            <Badge
                              variant={p.is_active ? "default" : "secondary"}
                              className="cursor-pointer transition-opacity hover:opacity-80"
                            >
                              {p.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => openEdit(p)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteProduct(p.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <p className="py-12 text-center text-muted-foreground text-sm">
                    No se encontraron productos con ese filtro.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal agregar / editar */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold text-lg">
                {editId ? "Editar producto" : "Agregar producto"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="pname">Nombre *</Label>
                <Input
                  id="pname"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Nombre del producto"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pdesc">Descripción</Label>
                <Input
                  id="pdesc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción breve"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="pprice">Precio CLP *</Label>
                  <Input
                    id="pprice"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pcat">Categoría</Label>
                  <Input
                    id="pcat"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    placeholder="Servicios"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pimg">URL de imagen</Label>
                <Input
                  id="pimg"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                  className={cn(
                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                    form.is_active ? "bg-primary" : "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200",
                      form.is_active ? "translate-x-5" : "translate-x-0",
                    )}
                  />
                </button>
                <span className="text-sm">{form.is_active ? "Producto activo" : "Producto inactivo"}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button
                onClick={saveProduct}
                disabled={!form.name.trim() || !form.price}
              >
                {editId ? "Guardar cambios" : "Crear producto"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
