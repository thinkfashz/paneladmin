import { notFound } from "next/navigation";

import { ProductCard } from "@/fabrick/store/components/product-card";
import { getPublicStoreProducts } from "@/fabrick/store/services/get-public-products";
import { getBusinessBySlug } from "@/fabrick/superadmin/services/business-service";

export const dynamic = "force-dynamic";

type StoreFrontPageProps = {
  params: {
    businessSlug: string;
  };
};

export default async function StoreFrontPage({ params }: StoreFrontPageProps) {
  const business = await getBusinessBySlug(params.businessSlug);

  if (!business || business.status === "blocked") {
    notFound();
  }

  const products = await getPublicStoreProducts(business.id);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-muted/20 px-4 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-bold text-3xl capitalize tracking-tight">{business.name}</h1>
          <p className="mt-1 text-muted-foreground">Tienda Oficial</p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <h2 className="mb-6 font-semibold text-2xl">Nuestros Productos y Servicios</h2>
        {products.length === 0 ? (
          <div className="rounded-2xl border bg-muted/10 py-12 text-center">
            <h3 className="font-medium text-lg">Catálogo vacío</h3>
            <p className="mt-2 text-muted-foreground">Este negocio aún no tiene productos activos publicados.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
