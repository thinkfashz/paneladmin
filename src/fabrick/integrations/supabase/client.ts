export type SupabaseHealthResult = {
  ok: boolean;
  configured: boolean;
  provider: "supabase";
  message: string;
  checkedAt: string;
};

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function isSupabaseConfigured() {
  const config = getSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}

export async function testSupabaseConnection(): Promise<SupabaseHealthResult> {
  const config = getSupabaseConfig();
  const checkedAt = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      configured: false,
      provider: "supabase",
      message: "Supabase no esta configurado. Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      checkedAt,
    };
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: config.anonKey!,
        Authorization: `Bearer ${config.anonKey}`,
      },
      cache: "no-store",
    });

    return {
      ok: response.ok,
      configured: true,
      provider: "supabase",
      message: response.ok
        ? "Supabase responde correctamente."
        : `Supabase respondio con estado ${response.status}. Revisa URL, anon key y permisos.`,
      checkedAt,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      provider: "supabase",
      message: error instanceof Error ? error.message : "Error desconocido conectando Supabase.",
      checkedAt,
    };
  }
}
