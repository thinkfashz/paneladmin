import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { BusinessSettings } from "./_components/business-settings";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return <BusinessSettings />;
}
