import type { Metadata } from "next";

import { OmnifixPremiumStorefront } from "@/fabrick/modules/public-storefront/omnifix-premium-storefront";

export const metadata: Metadata = {
  title: "Tienda Omnifix | Catálogo y cotización",
  description: "Catálogo público Omnifix con búsqueda, servicios destacados y acceso rápido al panel administrativo.",
};

export default function TiendaPage() {
  return <OmnifixPremiumStorefront />;
}
