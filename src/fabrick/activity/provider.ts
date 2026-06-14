import { getInsforgeRuntimeConfig, getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

export type ActivityProviderId = "insforge" | "supabase" | "pocketbase" | "console";

export function getActivityProvider(): ActivityProviderId {
  if (getInsforgeRuntimeConfig()) return "insforge";
  if (getSupabaseRuntimeConfig()) return "supabase";
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
