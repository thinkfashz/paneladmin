import { redirect } from "next/navigation";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import SqlConsoleClient from "@/fabrick/modules/database/SqlConsoleClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Consola SQL Omnifix | Admin DB",
  description: "Consola SQL blindada para Supabase o Insforge, creación de tablas y tester de conexión realtime.",
};

export default async function SqlConsolePage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  return <SqlConsoleClient />;
}
