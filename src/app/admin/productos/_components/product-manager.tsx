"use client";

import { useState } from "react";

import { Edit2, Package, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Product } from "@/fabrick/store/types";
import { cn } from "@/lib/utils";

type ProductManagerProps = { products: Product[] };

const fmt = (n: number) =>
  n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export function ProductManager({ products: initial }: ProductManagerProps) {
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const categories = ["all", ...Array.from(new Set(products.flatMap((p) => (p.category ? [p.category] : []))))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchSearch && (filterCat === "all" || p.category === filterCat);
  });

  const toggleActive = (id: string) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, is_active: !p.is_active } : p)));

  if (initial.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-semibold text-lg">Sin productos</h3>
          <p className="mt-1 max-w-sm text-muted-foreground text-sm">
            Agrega tu primer producto para que aparezca en tu tienda pública.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros */}
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
      </div>

      {/* Stats rápidos */}
      <p className="text-muted-foreground text-sm">
        {filtered.length} productos ·{" "}
        <span className="text-green-600">{products.filter((p) => p.is_active).length} activos</span>
        {" "}· {products.filter((p) => !p.is_active).length} inactivos
      </p>

      {/* Tabla */}
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
                        <Badge variant="outline" className="text-xs">
                          {p.category}
                        </Badge>
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
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
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
    </div>
  );
}
