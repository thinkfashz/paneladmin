import type { Metadata } from "next";

import { OmnifixPremiumStorefront } from "@/fabrick/modules/public-storefront/omnifix-premium-storefront";

export const metadata: Metadata = {
  title: "Tienda Omnifix | Servicio técnico y soluciones digitales",
  description: "Vitrina pública Omnifix con diseño premium mobile-first, catálogo, búsqueda, cotización rápida y acceso al panel.",
};

export default function PublicStorefrontPage() {
  return <OmnifixPremiumStorefront />;
}
