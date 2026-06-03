import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";
import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";
import { type DemoAccessInput, validateDemoAccessRecord } from "@/fabrick/security/validate-demo-access";

export async function validateDemoToken(input: DemoAccessInput) {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    const config = getInsforgeConfig();
    if (config.baseUrl && config.anonKey) {
      // Buscar si el negocio y token están activos
      // ... lógicamente esto debería usar JOIN pero por simplicidad se hace una búsqueda simulada
    }
  }

  // Placeholder validation until DB lookup logic is robustly matched to a real view
  return validateDemoAccessRecord(input, {
    businessId: "0000",
    businessSlug: input.slug ?? "mock",
    businessStatus: "demo",
    tokenHash: "mockHash",
    expiresAt: new Date(Date.now() + 100000).toISOString(),
    isActive: true,
  });
}
