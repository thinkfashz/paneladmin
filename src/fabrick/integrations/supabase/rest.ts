// Cliente REST minimo para Supabase (PostgREST) usando la service role key.
// Solo servidor: nunca importar desde componentes cliente.

import { getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

type SupabaseRestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  prefer?: string;
};

export type SupabaseRestResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  message: string;
};

export async function supabaseRest<T>(
  pathWithQuery: string,
  options: SupabaseRestOptions = {},
): Promise<SupabaseRestResult<T>> {
  const config = getSupabaseRuntimeConfig();

  if (!config) {
    return { ok: false, status: 0, data: null, message: "Supabase no esta configurado." };
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/${pathWithQuery}`, {
      method: options.method ?? "GET",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
        ...(options.prefer ? { Prefer: options.prefer } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });

    let data: T | null = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = null;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: response.ok ? "OK" : `Supabase respondio con estado ${response.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      message: err instanceof Error ? err.message : "Error de red consultando Supabase.",
    };
  }
}

// Prueba una conexion con credenciales arbitrarias (aun no guardadas).
export async function testSupabaseCredentials(url: string, serviceRoleKey: string) {
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return { ok: true, message: "Conexion exitosa con Supabase." };
    }

    if (response.status === 401 || response.status === 403) {
      return { ok: false, message: "La URL responde pero la service role key no es valida." };
    }

    return { ok: false, message: `Supabase respondio con estado ${response.status}.` };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? `No se pudo conectar: ${err.message}` : "No se pudo conectar con esa URL.",
    };
  }
}

// Verifica que las tablas de la migracion existan en el proyecto.
export async function checkTablesExist(url: string, serviceRoleKey: string, tables: readonly string[]) {
  const missing: string[] = [];

  for (const table of tables) {
    try {
      const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?select=*&limit=0`, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        cache: "no-store",
      });

      if (!response.ok) missing.push(table);
    } catch {
      missing.push(table);
    }
  }

  return { ok: missing.length === 0, missing };
}
