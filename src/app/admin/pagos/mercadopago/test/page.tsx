import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import MercadoPagoTestClient from "@/fabrick/modules/payments/MercadoPagoTestClient";

export const dynamic = "force-dynamic";

export default async function MercadoPagoSandboxTestPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return <MercadoPagoTestClient />;
}
