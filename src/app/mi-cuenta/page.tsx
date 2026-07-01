import OmnifixCustomerDashboardClient from "@/fabrick/modules/customer/OmnifixCustomerDashboardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi cuenta Omnifix | Pedidos y soporte",
  description: "Dashboard cliente Omnifix con pedidos, historial de compra, favoritos, comentarios y chat de soporte.",
};

export default function MiCuentaPage() {
  return <OmnifixCustomerDashboardClient />;
}
