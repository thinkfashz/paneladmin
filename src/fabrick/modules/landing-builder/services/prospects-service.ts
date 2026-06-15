import type { CrmProspect, ImportedProspectInput, ProspectSocialNetworks } from "../types-prospect";

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function sqlString(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
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

function getInsForgeConfig() {
  return {
    url: process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL || process.env.INSFORGE_BASE_URL,
    apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY,
  };
}

async function runInsForgeSql(query: string) {
  const config = getInsForgeConfig();

  if (!config.url || !config.apiKey) {
    return {
      ok: false,
      status: 0,
      data: null as unknown,
      message: "InsForge no está configurado. Faltan URL o API key.",
    };
  }

  try {
    const response = await fetch(`${normalizeUrl(config.url)}/api/database/advance/rawsql/unrestricted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
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
      message: response.ok ? "OK" : `InsForge respondió con estado ${response.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: null as unknown,
      message: err instanceof Error ? err.message : "No se pudo conectar con InsForge",
    };
  }
}

export async function ensureProspectsTable() {
  const query = `
    create table if not exists public.crm_prospects (
      id uuid primary key default gen_random_uuid(),
      brand_name text not null,
      project_name text,
      followers text,
      social_networks jsonb not null default '{}'::jsonb,
      phone text,
      email text,
      website text,
      color_palette jsonb not null default '[]'::jsonb,
      notes text,
      source text,
      raw jsonb,
      landing_token text,
      landing_url text,
      created_at timestamptz not null default now(),
      updated_at timestamptz
    );

    create index if not exists crm_prospects_brand_name_idx on public.crm_prospects(brand_name);
    create index if not exists crm_prospects_created_at_idx on public.crm_prospects(created_at);
    create index if not exists crm_prospects_landing_token_idx on public.crm_prospects(landing_token);
  `;

  return runInsForgeSql(query);
}

export async function importProspects(inputs: ImportedProspectInput[]) {
  await ensureProspectsTable();

  const clean = inputs
    .map(normalizeProspectInput)
    .filter((item) => item.brandName.trim().length > 0);

  if (clean.length === 0) {
    return {
      ok: false,
      message: "El JSON no contiene prospectos válidos.",
      count: 0,
    };
  }

  const values = clean
    .map((item) => {
      return `(
        ${sqlString(item.brandName)},
        ${sqlString(item.projectName || null)},
        ${sqlString(item.followers ? String(item.followers) : null)},
        ${sqlString(JSON.stringify(item.socialNetworks || {}))}::jsonb,
        ${sqlString(item.phone || null)},
        ${sqlString(item.email || null)},
        ${sqlString(item.website || null)},
        ${sqlString(JSON.stringify(item.colorPalette || []))}::jsonb,
        ${sqlString(item.notes || null)},
        ${sqlString(item.source || "json-import")},
        ${sqlString(JSON.stringify(item.raw || item))}::jsonb
      )`;
    })
    .join(",");

  const query = `
    insert into public.crm_prospects (
      brand_name,
      project_name,
      followers,
      social_networks,
      phone,
      email,
      website,
      color_palette,
      notes,
      source,
      raw
    )
    values ${values}
    returning id
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      count: 0,
    };
  }

  return {
    ok: true,
    message: "Prospectos importados correctamente.",
    count: clean.length,
  };
}

export async function listProspects() {
  await ensureProspectsTable();

  const query = `
    select
      id,
      brand_name,
      project_name,
      followers,
      social_networks,
      phone,
      email,
      website,
      color_palette,
      notes,
      source,
      landing_token,
      landing_url,
      created_at
    from public.crm_prospects
    order by created_at desc
    limit 50
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      prospects: [] as CrmProspect[],
    };
  }

  return {
    ok: true,
    message: "OK",
    prospects: extractRows(result.data).map(mapProspect),
  };
}

export async function getProspectByLandingToken(token: string) {
  await ensureProspectsTable();

  const query = `
    select
      id,
      brand_name,
      project_name,
      followers,
      social_networks,
      phone,
      email,
      website,
      color_palette,
      notes,
      source,
      landing_token,
      landing_url,
      created_at
    from public.crm_prospects
    where landing_token = ${sqlString(token)}
    limit 1
  `;

  const result = await runInsForgeSql(query);
  if (!result.ok) return null;

  const row = extractRows(result.data)[0];
  if (!row) return null;

  return mapProspect(row);
}

export async function getProspectById(id: string) {
  await ensureProspectsTable();

  const query = `
    select
      id,
      brand_name,
      project_name,
      followers,
      social_networks,
      phone,
      email,
      website,
      color_palette,
      notes,
      source,
      landing_token,
      landing_url,
      created_at
    from public.crm_prospects
    where id = ${sqlString(id)}
    limit 1
  `;

  const result = await runInsForgeSql(query);
  if (!result.ok) return null;

  const row = extractRows(result.data)[0];
  if (!row) return null;

  return mapProspect(row);
}

export async function attachLandingToProspect(input: {
  prospectId: string;
  landingToken: string;
  landingUrl: string;
}) {
  await ensureProspectsTable();

  const query = `
    update public.crm_prospects
    set
      landing_token = ${sqlString(input.landingToken)},
      landing_url = ${sqlString(input.landingUrl)},
      updated_at = now()
    where id = ${sqlString(input.prospectId)}
  `;

  return runInsForgeSql(query);
}

function normalizeProspectInput(input: ImportedProspectInput): ImportedProspectInput {
  return {
    brandName: String(input.brandName || "").trim(),
    projectName: input.projectName ? String(input.projectName).trim() : null,
    followers: input.followers ? String(input.followers).trim() : null,
    socialNetworks: input.socialNetworks || {},
    phone: input.phone ? String(input.phone).trim() : null,
    email: input.email ? String(input.email).trim() : null,
    website: input.website ? String(input.website).trim() : null,
    colorPalette: Array.isArray(input.colorPalette) ? input.colorPalette.map(String) : [],
    notes: input.notes ? String(input.notes).trim() : null,
    source: input.source ? String(input.source).trim() : "json-import",
    raw: input.raw || input,
  };
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  if (typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>;

  return {};
}

function parseJsonArray(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) return value.map(String);

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function mapProspect(row: Record<string, unknown>): CrmProspect {
  const landingToken = row.landing_token ? String(row.landing_token) : null;

  return {
    id: String(row.id || ""),
    brandName: String(row.brand_name || "Marca sin nombre"),
    projectName: row.project_name ? String(row.project_name) : null,
    followers: row.followers ? String(row.followers) : null,
    socialNetworks: parseJsonObject(row.social_networks) as ProspectSocialNetworks,
    phone: row.phone ? String(row.phone) : null,
    email: row.email ? String(row.email) : null,
    website: row.website ? String(row.website) : null,
    colorPalette: parseJsonArray(row.color_palette),
    notes: row.notes ? String(row.notes) : null,
    source: row.source ? String(row.source) : null,
    landingToken,
    landingUrl: row.landing_url ? String(row.landing_url) : landingToken ? `/p/${landingToken}` : null,
    createdAt: String(row.created_at || ""),
  };
}
