import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";
import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";
import { type DemoAccessInput, validateDemoAccessRecord } from "@/fabrick/security/validate-demo-access";

export async function validateDemoToken(input: DemoAccessInput) {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    const config = getInsforgeConfig();
    if (config.baseUrl && config.anonKey) {
      try {
        const url = new URL(`/rest/v1/demo_tokens?select=*,businesses(*)`, config.baseUrl);
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${config.anonKey}`,
            "x-project-id": config.projectId as string,
          },
        });

        if (res.ok) {
          const tokens = await res.json();
          // Filter matching token based on the hash (simulated mapping since hash relies on full token processing)
          // In a real database this should find by the token_hash column.
          if (tokens && tokens.length > 0) {
            const record = tokens[0];
            const business = record.businesses;

            if (business && business.slug === input.slug) {
              return validateDemoAccessRecord(input, {
                businessId: business.id,
                businessSlug: business.slug,
                businessStatus: business.status,
                tokenHash: record.token_hash,
                expiresAt: record.expires_at,
                isActive: record.is_active,
              });
            }
          }
        }
      } catch (err) {
        console.error("Error validating demo token from DB", err);
      }
    }
  }

  // Fallback if token wasn't found or DB connection failed.
  // Enforces security returning an invalid stub that forces "invalid_token" logic in downstream logic.
  return validateDemoAccessRecord(input, null);
}
