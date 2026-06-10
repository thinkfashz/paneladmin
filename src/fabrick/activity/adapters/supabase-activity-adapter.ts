import { getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

import type { ActivityRecord, ActivityWriteResult } from "../types";

export async function writeActivityToSupabase(record: ActivityRecord): Promise<ActivityWriteResult> {
  const config = getSupabaseRuntimeConfig();
  const url = config?.url;
  const serviceKey = config?.serviceRoleKey;

  if (!url || !serviceKey) {
    return {
      ok: false,
      provider: "supabase",
      message: "Supabase no esta configurado para activity.",
      record,
    };
  }

  try {
    const response = await fetch(`${url}/rest/v1/activity_records`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(record),
      cache: "no-store",
    });

    return {
      ok: response.ok,
      provider: "supabase",
      message: response.ok ? "Activity guardada en Supabase." : `Supabase respondio con estado ${response.status}.`,
      record,
    };
  } catch (error) {
    return {
      ok: false,
      provider: "supabase",
      message: error instanceof Error ? error.message : "Error desconocido guardando activity en Supabase.",
      record,
    };
  }
}
