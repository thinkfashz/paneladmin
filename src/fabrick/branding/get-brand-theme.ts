import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import { getInsforgeBrandTheme } from "./adapters/insforge-branding-adapter";
import { defaultBrandTheme } from "./default-brand";
import type { BrandTheme } from "./types";

export type GetBrandThemeOptions = {
  businessId?: string | null;
};

export async function getBrandTheme(options: GetBrandThemeOptions = {}): Promise<BrandTheme> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return getInsforgeBrandTheme(options);
  }

  // TODO: Add support for supabase/pocketbase when those adapters are ready.
  return defaultBrandTheme;
}
