import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { AnalyticsDashboard } from "./components/analytics-dashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="flex flex-col gap-1.5 rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">Negocio</p>
        <h1 className="font-bold text-2xl tracking-tight md:text-3xl">Analytics & Reportes</h1>
        <p className="max-w-xl text-muted-foreground text-sm">
          Visualiza el rendimiento de tu negocio: ventas, clientes, conversiones y proyección tributaria.
        </p>
      </section>
      <AnalyticsDashboard />
    </main>
  );
}
