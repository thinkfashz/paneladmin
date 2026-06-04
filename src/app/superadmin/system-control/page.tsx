import { redirect } from "next/navigation";

import { requireSuperadminAuth } from "@/fabrick/auth/require-superadmin";
import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";
import { systemControlItems } from "@/fabrick/system-control/items";
import { SystemControlUI } from "@/fabrick/system-control/ui";

export const dynamic = "force-dynamic";

export default async function SystemControlPage() {
  const auth = await requireSuperadminAuth();

  if (!auth.allowed) {
    redirect("/auth/v1/login");
  }

  // We enforce the fact that the page should verify it strictly
  const role = "superadmin"; // Validated by requireSuperadminAuth above
  const provider = getActiveDatabaseProvider();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <SystemControlUI role={role} provider={provider} items={systemControlItems} />
    </main>
  );
}
