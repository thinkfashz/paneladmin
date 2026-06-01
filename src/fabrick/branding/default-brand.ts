import type { BrandTheme } from "./types";

export const defaultBrandTheme: BrandTheme = {
  identity: {
    businessId: null,
    name: "Fabrick Admin",
    logoUrl: null,
    primaryColor: "#111827",
    secondaryColor: "#22c55e",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    tagline: "Sistema inteligente para negocios modernos",
  },
  loading: {
    durationMs: 3000,
    showLogo: true,
    showName: true,
    message: "Preparando tu panel...",
  },
};
