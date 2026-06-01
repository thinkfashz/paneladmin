import type { BrandTheme } from "./types";

export type UpdateBrandThemeInput = Partial<BrandTheme["identity"]> & {
  businessId: string;
};

export async function updateBrandTheme(input: UpdateBrandThemeInput) {
  // TODO: Persistir en business_settings con proveedor activo.
  // No se escribe aun para evitar cambios inseguros antes de auth real.
  return {
    ok: true,
    message: "Branding preparado para actualizacion futura.",
    input,
  };
}
