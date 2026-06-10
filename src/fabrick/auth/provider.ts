import { getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

export type AuthProviderId = "insforge" | "supabase" | "pocketbase" | "none";

export function getAuthProvider(): AuthProviderId {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_PROJECT_ID) return "insforge";
  // Supabase puede venir de variables de entorno o de la configuracion
  // guardada por el asistente de primer inicio.
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
