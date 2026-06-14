import { checkTablesExist, testSupabaseCredentials } from "@/fabrick/integrations/supabase/rest";

export type DatabaseProvider = "supabase" | "insforge";

export type DatabaseCredentialInput = {
  provider?: DatabaseProvider;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  insforgeBaseUrl?: string;
  insforgeAnonKey?: string;
  insforgeProjectId?: string;
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
      insforgeAnonKey: string;
      insforgeProjectId: string;
    };

export type ProviderEnvStatus = {
  provider: DatabaseProvider;
  label: string;
  detected: boolean;
  variables: { name: string; detected: boolean }[];
};

export function getEnvProvider(): DatabaseProvider {
  if (process.env.INSFORGE_BASE_URL && process.env.INSFORGE_ANON_KEY && process.env.INSFORGE_PROJECT_ID) {
    return "insforge";
  }

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
    { name: "INSFORGE_ANON_KEY", detected: Boolean(process.env.INSFORGE_ANON_KEY) },
    { name: "INSFORGE_PROJECT_ID", detected: Boolean(process.env.INSFORGE_PROJECT_ID) },
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

  if (provider === "insforge") {
    const insforgeBaseUrl = process.env.INSFORGE_BASE_URL || input.insforgeBaseUrl;
    const insforgeAnonKey = process.env.INSFORGE_ANON_KEY || input.insforgeAnonKey;
    const insforgeProjectId = process.env.INSFORGE_PROJECT_ID || input.insforgeProjectId;

    if (!insforgeBaseUrl || !insforgeAnonKey || !insforgeProjectId) return null;
    return { provider, insforgeBaseUrl: insforgeBaseUrl.replace(/\/$/, ""), insforgeAnonKey, insforgeProjectId };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || input.supabaseUrl;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || input.supabaseAnonKey;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || input.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) return null;
  return { provider, supabaseUrl: supabaseUrl.replace(/\/$/, ""), supabaseAnonKey, supabaseServiceRoleKey };
}

export async function testDatabaseCredentials(credentials: ResolvedDatabaseCredentials) {
  if (credentials.provider === "supabase") {
    return testSupabaseCredentials(credentials.supabaseUrl, credentials.supabaseServiceRoleKey);
  }

  try {
    const response = await fetch(credentials.insforgeBaseUrl, {
      headers: {
        Authorization: `Bearer ${credentials.insforgeAnonKey}`,
        "x-project-id": credentials.insforgeProjectId,
      },
      cache: "no-store",
    });

    return {
      ok: response.ok,
      message: response.ok ? "Conexion exitosa con InsForge." : `InsForge respondio con estado ${response.status}.`,
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

  return { ok: true, missing: [] };
}

export async function upsertAdminProfile(
  credentials: ResolvedDatabaseCredentials,
  profile: { email: string; fullName: string; passwordHash: string },
) {
  if (credentials.provider !== "supabase") {
    return { ok: false, message: "La creacion de superadmin para InsForge aun no esta implementada." };
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
