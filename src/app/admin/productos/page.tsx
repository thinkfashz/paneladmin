import { redirect } from "next/navigation";

import { Package, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { getPublicStoreProducts } from "@/fabrick/store/services/get-public-products";

import { ProductManager } from "./_components/product-manager";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  const products = await getPublicStoreProducts(auth.businessId);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Tienda</p>
            <Badge variant="secondary">{products.length} productos</Badge>
          </div>
          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">Catálogo de Productos</h1>
          <p className="max-w-xl text-muted-foreground text-sm">
            Gestiona tu catálogo. Activa, edita o desactiva productos de tu tienda pública.
          </p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="h-4 w-4" />
          Agregar Producto
        </Button>
      </section>
      <ProductManager products={products} />
    </main>
  );
}
