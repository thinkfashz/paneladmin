import { defaultBrandTheme } from "./default-brand";
import type { BrandTheme } from "./types";

export type GetBrandThemeOptions = {
  businessId?: string | null;
};

export async function getBrandTheme(_options: GetBrandThemeOptions = {}): Promise<BrandTheme> {
  // TODO: Conectar con business_settings cuando el proveedor de datos este activo.
  // Por ahora retorna tema por defecto para no romper el dashboard.
  return defaultBrandTheme;
}
