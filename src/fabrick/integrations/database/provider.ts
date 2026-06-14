import { checkTablesExist, testSupabaseCredentials } from "@/fabrick/integrations/supabase/rest";
import { loadRuntimeConfig } from "@/fabrick/setup/config-store";

export type DatabaseProvider = "supabase" | "insforge";

export type DatabaseCredentialInput = {
  provider?: DatabaseProvider;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  insforgeBaseUrl?: string;
  insforgeApiKey?: string;
};

export type ResolvedDatabaseCredentials =
  | {
      provider: "supabase";
      supabaseUrl: string;
      supabaseAnonKey: string;
      supabaseServiceRoleKey: string;
    }
  | {
      provider: "insforge";
      insforgeBaseUrl: string;
      insforgeApiKey: string;
    };

export type ProviderEnvStatus = {
  provider: DatabaseProvider;
  label: string;
  detected: boolean;
  variables: { name: string; detected: boolean }[];
};

type ProfileRow = { id: string; email: string };

function cleanUrl(value: string) {
  return value.replace(/\/$/, "");
}

function getEnvInsforgeApiKey() {
  return process.env.INSFORGE_API_KEY || process.env.INSFORGE_ANON_KEY;
}

function getStoredConfig() {
  return loadRuntimeConfig();
}

function getInsforgeAuthHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

async function readJsonMessage(response: Response) {
  const text = await response.text();
  if (!text) return `estado ${response.status}`;

  try {
    const data = JSON.parse(text) as { message?: string; error?: string };
    return data.message || data.error || `estado ${response.status}`;
  } catch {
    return text.slice(0, 180) || `estado ${response.status}`;
  }
}

export function getEnvProvider(): DatabaseProvider {
  if (process.env.INSFORGE_BASE_URL && getEnvInsforgeApiKey()) return "insforge";
  return "supabase";
}

export function getAllProviderEnvStatuses(): ProviderEnvStatus[] {
  const supabaseVariables = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", detected: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", detected: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) },
    { name: "SUPABASE_SERVICE_ROLE_KEY", detected: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) },
  ];
  const insforgeVariables = [
    { name: "INSFORGE_BASE_URL", detected: Boolean(process.env.INSFORGE_BASE_URL) },
    { name: "INSFORGE_API_KEY", detected: Boolean(getEnvInsforgeApiKey()) },
  ];

  return [
    {
      provider: "supabase",
      label: "Supabase",
      detected: supabaseVariables.every((variable) => variable.detected),
      variables: supabaseVariables,
    },
    {
      provider: "insforge",
      label: "InsForge",
      detected: insforgeVariables.every((variable) => variable.detected),
      variables: insforgeVariables,
    },
  ];
}

export function resolveDatabaseCredentials(input: DatabaseCredentialInput): ResolvedDatabaseCredentials | null {
  const provider = input.provider ?? getEnvProvider();
  const stored = getStoredConfig();

  if (provider === "insforge") {
    const insforgeBaseUrl = process.env.INSFORGE_BASE_URL || stored?.insforgeBaseUrl || input.insforgeBaseUrl;
    const insforgeApiKey = getEnvInsforgeApiKey() || stored?.insforgeApiKey || input.insforgeApiKey;

    if (!insforgeBaseUrl || !insforgeApiKey) return null;
    return { provider, insforgeBaseUrl: cleanUrl(insforgeBaseUrl), insforgeApiKey };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || stored?.supabaseUrl || input.supabaseUrl;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || stored?.supabaseAnonKey || input.supabaseAnonKey;
  const supabaseServiceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || stored?.supabaseServiceRoleKey || input.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) return null;
  return { provider, supabaseUrl: cleanUrl(supabaseUrl), supabaseAnonKey, supabaseServiceRoleKey };
}

export async function testDatabaseCredentials(credentials: ResolvedDatabaseCredentials) {
  if (credentials.provider === "supabase") {
    return testSupabaseCredentials(credentials.supabaseUrl, credentials.supabaseServiceRoleKey);
  }

  try {
    const response = await fetch(`${credentials.insforgeBaseUrl}/api/database/functions`, {
      headers: getInsforgeAuthHeaders(credentials.insforgeApiKey),
      cache: "no-store",
    });

    return {
      ok: response.ok,
      message: response.ok
        ? "Conexion exitosa con InsForge."
        : `InsForge respondio con ${await readJsonMessage(response)}.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? `No se pudo conectar: ${err.message}` : "No se pudo conectar con InsForge.",
    };
  }
}

export async function checkDatabaseTablesExist(credentials: ResolvedDatabaseCredentials, tables: readonly string[]) {
  if (credentials.provider === "supabase") {
    return checkTablesExist(credentials.supabaseUrl, credentials.supabaseServiceRoleKey, tables);
  }

  const missing: string[] = [];
  for (const table of tables) {
    try {
      const response = await fetch(`${credentials.insforgeBaseUrl}/api/database/records/${table}?limit=1`, {
        headers: getInsforgeAuthHeaders(credentials.insforgeApiKey),
        cache: "no-store",
      });

      if (!response.ok) missing.push(table);
    } catch {
      missing.push(table);
    }
  }

  return { ok: missing.length === 0, missing };
}

export async function applyDatabaseMigration(
  credentials: ResolvedDatabaseCredentials,
  input: { sql: string; name?: string },
) {
  if (credentials.provider === "supabase") {
    return {
      ok: false,
      message: "Supabase requiere ejecutar el SQL manualmente desde SQL Editor.",
    };
  }

  try {
    const response = await fetch(`${credentials.insforgeBaseUrl}/api/database/migrations`, {
      method: "POST",
      headers: getInsforgeAuthHeaders(credentials.insforgeApiKey),
      body: JSON.stringify({
        version: new Date().toISOString().replace(/\D/g, "").slice(0, 14),
        name: input.name ?? "fabrick-initial-schema",
        sql: input.sql,
      }),
    });

    return {
      ok: response.ok,
      message: response.ok
        ? "Migracion aplicada en InsForge."
        : `No se pudo aplicar la migracion en InsForge: ${await readJsonMessage(response)}.`,
    };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? `Error aplicando migracion: ${err.message}` : "Error aplicando migracion.",
    };
  }
}

export async function upsertAdminProfile(
  credentials: ResolvedDatabaseCredentials,
  profile: { email: string; fullName: string; passwordHash: string },
) {
  if (credentials.provider === "insforge") {
    return upsertInsforgeAdminProfile(credentials, profile);
  }

  const serviceHeaders = {
    apikey: credentials.supabaseServiceRoleKey,
    Authorization: `Bearer ${credentials.supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };

  try {
    const existingRes = await fetch(
      `${credentials.supabaseUrl}/rest/v1/profiles?select=id,role&email=eq.${encodeURIComponent(profile.email)}`,
      { headers: serviceHeaders, cache: "no-store" },
    );
    const existing = existingRes.ok ? await existingRes.json() : [];

    if (Array.isArray(existing) && existing.length > 0) {
      const updateRes = await fetch(`${credentials.supabaseUrl}/rest/v1/profiles?id=eq.${existing[0].id}`, {
        method: "PATCH",
        headers: { ...serviceHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({
          full_name: profile.fullName,
          password_hash: profile.passwordHash,
          role: "superadmin",
          is_active: true,
        }),
      });

      return {
        ok: updateRes.ok,
        message: updateRes.ok
          ? "Cuenta admin actualizada."
          : `No se pudo actualizar la cuenta admin (estado ${updateRes.status}).`,
      };
    }

    const insertRes = await fetch(`${credentials.supabaseUrl}/rest/v1/profiles`, {
      method: "POST",
      headers: { ...serviceHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({
        email: profile.email,
        full_name: profile.fullName,
        password_hash: profile.passwordHash,
        role: "superadmin",
        is_active: true,
      }),
    });

    return {
      ok: insertRes.ok,
      message: insertRes.ok ? "Cuenta admin creada." : `No se pudo crear la cuenta admin (estado ${insertRes.status}).`,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? `Error creando la cuenta admin: ${err.message}` : "Error creando la cuenta admin.",
    };
  }
}

async function upsertInsforgeAdminProfile(
  credentials: Extract<ResolvedDatabaseCredentials, { provider: "insforge" }>,
  profile: { email: string; fullName: string; passwordHash: string },
) {
  const headers = getInsforgeAuthHeaders(credentials.insforgeApiKey);

  try {
    const existingRes = await fetch(
      `${credentials.insforgeBaseUrl}/api/database/records/profiles?select=id,email&email=eq.${encodeURIComponent(profile.email)}&limit=1`,
      { headers, cache: "no-store" },
    );

    if (!existingRes.ok) {
      return {
        ok: false,
        message: `No se pudo consultar profiles en InsForge: ${await readJsonMessage(existingRes)}.`,
      };
    }

    const existing = (await existingRes.json()) as ProfileRow[];
    const body = {
      email: profile.email,
      full_name: profile.fullName,
      password_hash: profile.passwordHash,
      role: "superadmin",
      is_active: true,
    };

    if (Array.isArray(existing) && existing.length > 0) {
      const updateRes = await fetch(
        `${credentials.insforgeBaseUrl}/api/database/records/profiles?id=eq.${encodeURIComponent(existing[0].id)}`,
        {
          method: "PATCH",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify(body),
        },
      );

      return {
        ok: updateRes.ok,
        message: updateRes.ok
          ? "Cuenta admin actualizada en InsForge."
          : `No se pudo actualizar la cuenta admin en InsForge: ${await readJsonMessage(updateRes)}.`,
      };
    }

    const insertRes = await fetch(`${credentials.insforgeBaseUrl}/api/database/records/profiles`, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify([body]),
    });

    return {
      ok: insertRes.ok,
      message: insertRes.ok
        ? "Cuenta admin creada en InsForge."
        : `No se pudo crear la cuenta admin en InsForge: ${await readJsonMessage(insertRes)}.`,
    };
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Error creando la cuenta admin en InsForge: ${err.message}`
          : "Error creando la cuenta admin en InsForge.",
    };
  }
}
