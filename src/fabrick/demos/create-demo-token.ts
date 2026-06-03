import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";
import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";
import { createDemoToken as createSecureToken } from "@/fabrick/security/token";

export async function createDemoToken(businessId: string, hours = 72) {
  const payload = await createSecureToken(hours);
  const provider = getActiveDatabaseProvider();

  // Guardar en BD (simulacion con Insforge)
  if (provider === "insforge") {
    const config = getInsforgeConfig();
    if (config.baseUrl && config.anonKey) {
      try {
        const url = new URL(`/rest/v1/demo_tokens`, config.baseUrl);
        await fetch(url.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.anonKey}`,
            "x-project-id": config.projectId as string,
          },
          body: JSON.stringify({
            business_id: businessId,
            token_hash: payload.tokenHash,
            expires_at: payload.expiresAt.toISOString(),
            is_active: true,
          }),
        });
      } catch (err) {
        console.error("Error creating demo token on DB", err);
      }
    }
  }

  // Devolvemos el token plano PARA MOSTRAR UNA SOLA VEZ AL USUARIO
  return payload;
}
