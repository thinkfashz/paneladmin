import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import { updateInsforgeBrandTheme } from "./adapters/insforge-branding-adapter";
import type { BrandTheme } from "./types";

export type UpdateBrandThemeInput = Partial<BrandTheme["identity"]> & {
  businessId: string;
};

export async function updateBrandTheme(input: UpdateBrandThemeInput) {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return updateInsforgeBrandTheme(input);
  }

  // TODO: Add support for supabase/pocketbase when those adapters are ready.
  return {
    ok: true,
    message: "Branding preparado para actualizacion futura.",
    input,
  };
}
