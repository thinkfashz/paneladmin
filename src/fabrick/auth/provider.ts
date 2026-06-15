import { getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

export type AuthProviderId = "insforge" | "supabase" | "pocketbase" | "none";

export function getAuthProvider(): AuthProviderId {
  const hasInsForgeUrl = Boolean(
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
      process.env.INSFORGE_API_URL ||
      process.env.INSFORGE_BASE_URL,
  );

  const hasInsForgeServerKey = Boolean(
    process.env.INSFORGE_SERVICE_ROLE_KEY ||
      process.env.INSFORGE_API_KEY ||
      process.env.INSFORGE_ANON_KEY,
  );

  if (process.env.DATABASE_PROVIDER === "insforge" || (hasInsForgeUrl && hasInsForgeServerKey)) {
    return "insforge";
  }

  if (getSupabaseRuntimeConfig()) return "supabase";
  if (process.env.POCKETBASE_URL) return "pocketbase";
  return "none";
}

export function getAuthProviderLabel(provider: AuthProviderId) {
  const labels: Record<AuthProviderId, string> = {
    insforge: "InsForge",
    supabase: "Supabase",
    pocketbase: "PocketBase",
    none: "Sin proveedor auth",
  };
  return labels[provider];
}
