import { checkTablesExist, testSupabaseCredentials } from "@/fabrick/integrations/supabase/rest";

export type DatabaseProvider = "supabase" | "insforge";

export type DatabaseCredentials = {
  provider: DatabaseProvider;
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

export type ProviderStatus = {
  provider: DatabaseProvider;
  configured: boolean;
  missing: string[];
  label: string;
  detected: boolean;
  variables: { name: string; detected: boolean }[];
};

export function normalizeProvider(value: unknown): DatabaseProvider {
  return value === "insforge" ? "insforge" : "supabase";
}

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

export function getEnvProvider(): DatabaseProvider {
  const configured = process.env.DATABASE_PROVIDER;
  if (configured === "supabase" || configured === "insforge") return configured;
  if (process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL) return "insforge";
  return "supabase";
}

export function getProviderEnvStatus(provider: DatabaseProvider): ProviderStatus {
  const missing: string[] = [];
  const variables: { name: string; detected: boolean }[] = [];

  const addVariable = (name: string, detected: boolean) => {
    variables.push({ name, detected });
    if (!detected) missing.push(name);
  };

  if (provider === "supabase") {
    addVariable("NEXT_PUBLIC_SUPABASE_URL", Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL));
    addVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY", Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
    addVariable("SUPABASE_SERVICE_ROLE_KEY", Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY));
  } else {
    addVariable("NEXT_PUBLIC_INSFORGE_URL or INSFORGE_API_URL", Boolean(process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL));
    addVariable("NEXT_PUBLIC_INSFORGE_ANON_KEY or INSFORGE_ANON_KEY", Boolean(process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY));
    addVariable("INSFORGE_SERVICE_ROLE_KEY or INSFORGE_API_KEY", Boolean(process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY));
  }

  const configured = missing.length === 0;

  return {
    provider,
    configured,
    missing,
    label: provider === "supabase" ? "Supabase" : "InsForge",
    detected: configured,
    variables,
  };
}

export function getAllProviderEnvStatuses(): ProviderStatus[] {
  return [getProviderEnvStatus("supabase"), getProviderEnvStatus("insforge")];
}

export function getCredentialsFromEnv(provider: DatabaseProvider): DatabaseCredentials | null {
  if (provider === "supabase") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !anonKey || !serviceRoleKey) return null;
    return { provider, url: normalizeUrl(url), anonKey, serviceRoleKey };
  }

  const url = process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY;
  const serviceRoleKey = process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY;
  if (!url || !anonKey || !serviceRoleKey) return null;
  return { provider, url: normalizeUrl(url), anonKey, serviceRoleKey };
}

export function resolveDatabaseCredentials(input: Partial<DatabaseCredentials>): DatabaseCredentials | null {
  const provider = normalizeProvider(input.provider ?? getEnvProvider());
  const env = getCredentialsFromEnv(provider);

  const url = input.url?.trim() || env?.url || "";
  const anonKey = input.anonKey?.trim() || env?.anonKey || "";
  const serviceRoleKey = input.serviceRoleKey?.trim() || env?.serviceRoleKey || "";

  if (!url || !anonKey || !serviceRoleKey) return null;
  return { provider, url: normalizeUrl(url), anonKey, serviceRoleKey };
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function runInsForgeRawSql(url: string, serviceRoleKey: string, query: string): Promise<{ ok: boolean; status: number; data: unknown; message: string }> {
  try {
    const response = await fetch(`${normalizeUrl(url)}/api/database/advance/rawsql/unrestricted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": serviceRoleKey,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      message: response.ok ? "OK" : `InsForge respondio con estado ${response.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null,
      message: err instanceof Error ? `No se pudo conectar con InsForge: ${err.message}` : "No se pudo conectar con InsForge.",
    };
  }
}

function extractRows(data: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(data)) return data as Array<Record<string, unknown>>;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as Array<Record<string, unknown>>;
    if (Array.isArray(obj.rows)) return obj.rows as Array<Record<string, unknown>>;
    if (obj.result && typeof obj.result === "object") {
      const result = obj.result as Record<string, unknown>;
      if (Array.isArray(result.rows)) return result.rows as Array<Record<string, unknown>>;
      if (Array.isArray(result.data)) return result.data as Array<Record<string, unknown>>;
    }
  }
  return [];
}

export async function testDatabaseCredentials(credentials: DatabaseCredentials) {
  if (credentials.provider === "supabase") {
    return testSupabaseCredentials(credentials.url, credentials.serviceRoleKey);
  }

  const result = await runInsForgeRawSql(credentials.url, credentials.serviceRoleKey, "select 1 as ok");
  if (result.ok) return { ok: true, message: "Conexion exitosa con InsForge." };
  if (result.status === 401 || result.status === 403) {
    return { ok: false, message: "La URL responde, pero la service role/API key de InsForge no es valida." };
  }
  return { ok: false, message: result.message };
}

export async function checkDatabaseTablesExist(credentials: DatabaseCredentials, tables: readonly string[]) {
  if (credentials.provider === "supabase") {
    return checkTablesExist(credentials.url, credentials.serviceRoleKey, tables);
  }

  const tableList = tables.map(sqlString).join(", ");
  const query = `select table_name from information_schema.tables where table_schema = 'public' and table_name in (${tableList})`;
  const result = await runInsForgeRawSql(credentials.url, credentials.serviceRoleKey, query);
  if (!result.ok) return { ok: false, missing: [...tables] };

  const found = new Set(extractRows(result.data).map((row) => String(row.table_name ?? row.tableName ?? "")));
  const missing = tables.filter((table) => !found.has(table));
  return { ok: missing.length === 0, missing };
}

export async function upsertAdminProfile(credentials: DatabaseCredentials, admin: { fullName: string; email: string; passwordHash: string }) {
  if (credentials.provider === "supabase") {
    const serviceHeaders = {
      apikey: credentials.serviceRoleKey,
      Authorization: `Bearer ${credentials.serviceRoleKey}`,
      "Content-Type": "application/json",
    };

    const existingRes = await fetch(
      `${credentials.url}/rest/v1/profiles?select=id,role&email=eq.${encodeURIComponent(admin.email)}`,
      { headers: serviceHeaders, cache: "no-store" },
    );
    const existing = existingRes.ok ? await existingRes.json() : [];

    if (Array.isArray(existing) && existing.length > 0) {
      const updateRes = await fetch(`${credentials.url}/rest/v1/profiles?id=eq.${existing[0].id}`, {
        method: "PATCH",
        headers: { ...serviceHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({
          full_name: admin.fullName,
          password_hash: admin.passwordHash,
          role: "superadmin",
          is_active: true,
        }),
      });
      if (!updateRes.ok) return { ok: false, message: `No se pudo actualizar la cuenta admin (estado ${updateRes.status}).` };
      return { ok: true, message: "Cuenta admin actualizada." };
    }

    const insertRes = await fetch(`${credentials.url}/rest/v1/profiles`, {
      method: "POST",
      headers: { ...serviceHeaders, Prefer: "return=minimal" },
      body: JSON.stringify({
        email: admin.email,
        full_name: admin.fullName,
        password_hash: admin.passwordHash,
        role: "superadmin",
        is_active: true,
      }),
    });
    if (!insertRes.ok) return { ok: false, message: `No se pudo crear la cuenta admin (estado ${insertRes.status}).` };
    return { ok: true, message: "Cuenta admin creada." };
  }

  const query = `insert into public.profiles (email, full_name, password_hash, role, is_active)
values (${sqlString(admin.email)}, ${sqlString(admin.fullName)}, ${sqlString(admin.passwordHash)}, 'superadmin', true)
on conflict (email) do update set
  full_name = excluded.full_name,
  password_hash = excluded.password_hash,
  role = 'superadmin',
  is_active = true`;

  const result = await runInsForgeRawSql(credentials.url, credentials.serviceRoleKey, query);
  if (!result.ok) return { ok: false, message: result.message };
  return { ok: true, message: "Cuenta admin creada o actualizada en InsForge." };
}
