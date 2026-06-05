import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { BeneficiosFiscales } from "./_components/beneficios-fiscales";
import { CarpetaTributaria } from "./_components/carpeta-tributaria";
import { DocumentosRequeridos } from "./_components/documentos-requeridos";
import { F29Calculator } from "./_components/f29-calculator";
import { SimuladorTributario } from "./_components/simulador-tributario";

export const dynamic = "force-dynamic";

export default async function ContabilidadPage() {
  const auth = await requireBusinessUserAuth();

  if (!auth.allowed || !auth.businessId) {
    redirect("/auth/v1/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 md:p-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Módulo Tributario · SII Chile</p>
          <h1 className="font-bold text-2xl md:text-3xl tracking-tight">Dashboard Contable / F29</h1>
          <p className="max-w-xl text-muted-foreground text-sm">
            Declara tu F29, optimiza tus impuestos, accede a créditos y beneficios tributarios en tiempo real.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://homer.sii.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Portal SII →
          </a>
          <a
            href="https://www.sii.cl/servicios_online/1039-.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Declarar F29
          </a>
        </div>
      </section>

      {/* Carpeta Tributaria – Progress & Créditos */}
      <CarpetaTributaria />

      {/* Calculadora F29 */}
      <F29Calculator />

      {/* Simulador + Beneficios */}
      <div className="grid gap-8 lg:grid-cols-2">
        <SimuladorTributario />
        <BeneficiosFiscales />
      </div>

      {/* Documentos y obligaciones */}
      <DocumentosRequeridos />
    </main>
  );
}
