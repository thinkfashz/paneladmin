export type RuntimeProvider = "insforge" | "supabase" | "pocketbase" | "none";

export function getRuntimeProvider(): RuntimeProvider {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_PROJECT_ID) return "insforge";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.POCKETBASE_URL) return "pocketbase";
  return "none";
}

export function getRuntimeProviderLabel(provider: RuntimeProvider) {
  const labels: Record<RuntimeProvider, string> = {
    insforge: "InsForge",
    supabase: "Supabase",
    pocketbase: "PocketBase",
    none: "Sin proveedor conectado",
  };

  return labels[provider];
}
