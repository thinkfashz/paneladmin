import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { CustomerTable } from "@/fabrick/crm/components/customer-table";
import { getCustomers } from "@/fabrick/crm/services/customer-service";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const auth = await requireBusinessUserAuth();

  if (!auth.allowed || !auth.businessId) {
    redirect("/auth/v1/login");
  }

  const businessId = auth.businessId;
  const customers = await getCustomers(businessId);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <p className="font-medium text-muted-foreground text-sm">CRM / Base de Datos</p>
          <h1 className="font-semibold text-3xl tracking-tight">Directorio de Clientes</h1>
          <p className="max-w-xl text-muted-foreground">
            Administra tus clientes, revisa su historial y segmenta por estados y etiquetas.
          </p>
        </div>
        <Button>Agregar Cliente</Button>
      </section>

      <section>
        <CustomerTable customers={customers} />
      </section>
    </main>
  );
}
