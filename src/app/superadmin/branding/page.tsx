import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireSuperadminAuth } from "@/fabrick/auth/require-superadmin";
import { BrandPreview } from "@/fabrick/branding/components/brand-preview";
import { BrandingForm } from "@/fabrick/branding/components/branding-form";
import { getBrandTheme } from "@/fabrick/branding/get-brand-theme";
import { updateBrandTheme } from "@/fabrick/branding/update-brand-theme";

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  const auth = await requireSuperadminAuth();

  if (!auth.allowed) {
    redirect("/login");
  }

  // To simulate, we could allow the superadmin to edit a specific business.
  // For now we'll simulate editing a "default" business ID or passing a parameter.
  // In a real scenario, this would likely be /superadmin/businesses/[id]/branding
  // But following the requirements of just a branding page we will assume a constant.
  const businessId = "00000000-0000-0000-0000-000000000000";
  const brand = await getBrandTheme({ businessId });

  const saveBrandingAction = async (input: Parameters<typeof updateBrandTheme>[0]) => {
    "use server";

    // Ensure the user is still superadmin
    const verifyAuth = await requireSuperadminAuth();
    if (!verifyAuth.allowed) {
      return { ok: false, message: "No autorizado." };
    }

    const result = await updateBrandTheme(input);

    if (result.ok) {
      revalidatePath("/superadmin/branding");
    }

    return { ok: result.ok, message: result.message };
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-muted-foreground text-sm">Superadmin / Sistema</p>
          <h1 className="font-semibold text-3xl tracking-tight">Gestión de Identidad de Marca</h1>
          <p className="max-w-3xl text-muted-foreground">
            Personaliza la apariencia del panel de control para el negocio actual. Los cambios se guardarán y aplicarán
            de inmediato.
          </p>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <div>
          <BrandingForm brand={brand} businessId={businessId} onSave={saveBrandingAction} />
        </div>
        <div className="space-y-6">
          <h2 className="font-semibold text-xl">Previsualización de Marca</h2>
          <BrandPreview brand={brand} />
        </div>
      </section>
    </main>
  );
}
