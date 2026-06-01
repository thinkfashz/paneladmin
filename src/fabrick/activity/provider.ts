export type ActivityProviderId = "insforge" | "supabase" | "pocketbase" | "console";

export function getActivityProvider(): ActivityProviderId {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_PROJECT_ID) return "insforge";
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return "supabase";
  if (process.env.POCKETBASE_URL) return "pocketbase";
  return "console";
}

export function getActivityProviderLabel(provider: ActivityProviderId) {
  const labels: Record<ActivityProviderId, string> = {
    insforge: "InsForge",
    supabase: "Supabase",
    pocketbase: "PocketBase",
    console: "Console fallback",
  };

  return labels[provider];
}
