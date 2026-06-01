export type AuthProviderId = "insforge" | "supabase" | "pocketbase" | "none";

export function getAuthProvider(): AuthProviderId {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_PROJECT_ID) return "insforge";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return "supabase";
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
