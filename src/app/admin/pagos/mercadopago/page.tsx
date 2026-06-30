import { redirect } from "next/navigation";

import MercadoPagoDashboardClient from "@/fabrick/modules/payments/MercadoPagoDashboardClient";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

export const dynamic = "force-dynamic";

export default async function MercadoPagoAdminPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return <MercadoPagoDashboardClient />;
}
