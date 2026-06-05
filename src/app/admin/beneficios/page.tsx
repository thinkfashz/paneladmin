import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { BeneficiosGuide } from "./_components/beneficios-guide";

export const dynamic = "force-dynamic";

export default async function BeneficiosPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            SII Chile · Optimización Tributaria
          </p>
          <h1 className="font-bold text-2xl tracking-tight md:text-3xl">
            Beneficios Fiscales & Ahorro Tributario
          </h1>
          <p className="max-w-2xl text-muted-foreground text-sm">
            Calcula en tiempo real cuánto puedes ahorrar en impuestos usando tus facturas, gastos y
            los beneficios tributarios que te corresponden por ley. Cada peso que gastas con factura
            genera crédito fiscal inmediato.
          </p>
        </div>
      </section>
      <BeneficiosGuide />
    </main>
  );
}
