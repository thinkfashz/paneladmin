import { redirect } from "next/navigation";

import { Paintbrush } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { BrandEditor } from "./components/brand-editor";

export const dynamic = "force-dynamic";

export default async function DisenioPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) {
    redirect("/auth/v1/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-6 shadow-sm md:flex-row md:items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-muted-foreground text-sm">Administración</p>
            <Badge variant="secondary">Nuevo</Badge>
          </div>
          <h1 className="font-semibold text-3xl tracking-tight">Módulo de Diseño</h1>
          <p className="max-w-xl text-muted-foreground">
            Personaliza la identidad visual de tu tienda pública: colores, tipografía, eslogan y más.
          </p>
        </div>
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <Paintbrush className="h-8 w-8 text-primary" />
        </div>
      </section>

      <BrandEditor />
    </main>
  );
}
