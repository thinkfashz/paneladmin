import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";

import { QuoteList } from "./components/quote-list";

export const dynamic = "force-dynamic";

export default async function CotizacionesPage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return <QuoteList />;
}
