import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { requireSuperadminAuth } from "@/fabrick/auth/require-superadmin";
import { BusinessList } from "@/fabrick/superadmin/components/business-list";
import { getBusinesses } from "@/fabrick/superadmin/services/business-service";

export const dynamic = "force-dynamic";

export default async function BusinessesPage() {
  const auth = await requireSuperadminAuth();

  if (!auth.allowed) {
    redirect("/auth/v1/login");
  }

  const businesses = await getBusinesses();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-muted-foreground text-sm">Superadmin / Plataforma</p>
          <h1 className="font-semibold text-3xl tracking-tight">Gestión de Negocios</h1>
          <p className="max-w-xl text-muted-foreground">
            Administra todos los clientes y demos de 72 horas activos en la plataforma.
          </p>
        </div>
        <Button>Crear Nuevo Negocio</Button>
      </section>

      <section>
        <BusinessList businesses={businesses} />
      </section>
    </main>
  );
}
