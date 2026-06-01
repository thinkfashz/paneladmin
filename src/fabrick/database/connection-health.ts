import { testInsforgeConnection } from "@/fabrick/integrations/insforge/client";
import { testPocketBaseConnection } from "@/fabrick/integrations/pocketbase/client";
import { testSupabaseConnection } from "@/fabrick/integrations/supabase/client";

export type DatabaseConnectionHealth = {
  provider: "insforge" | "supabase" | "pocketbase";
  ok: boolean;
  configured: boolean;
  message: string;
  checkedAt: string;
};

export async function getDatabaseConnectionHealth(): Promise<DatabaseConnectionHealth[]> {
  const results = await Promise.allSettled([
    testInsforgeConnection(),
    testSupabaseConnection(),
    testPocketBaseConnection(),
  ]);

  return results.map((result, index) => {
    const provider = ["insforge", "supabase", "pocketbase"][index] as DatabaseConnectionHealth["provider"];

    if (result.status === "fulfilled") {
      return result.value;
    }

    return {
      provider,
      ok: false,
      configured: false,
      message: result.reason instanceof Error ? result.reason.message : "Error desconocido probando conexion.",
      checkedAt: new Date().toISOString(),
    };
  });
}
