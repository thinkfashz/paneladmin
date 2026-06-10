import { redirect } from "next/navigation";

import { canRunSetup } from "@/fabrick/setup/config-store";
import { MIGRATION_SQL } from "@/fabrick/setup/migration-sql";

import { SetupWizard } from "./_components/setup-wizard";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  // Candado: si el setup ya se completo, nadie puede volver a entrar aqui.
  if (!canRunSetup()) {
    redirect("/auth/v1/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <SetupWizard migrationSql={MIGRATION_SQL} />
    </main>
  );
}
