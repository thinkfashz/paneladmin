export type DatabaseProvider = "supabase" | "insforge";
export type SqlMode = "read" | "write";

export const REQUIRED_TABLES = [
  "omnifix_products",
  "omnifix_customers",
  "omnifix_orders",
  "omnifix_order_items",
  "omnifix_payments",
  "omnifix_likes",
  "omnifix_comments",
  "omnifix_support_messages",
  "omnifix_audit_logs",
] as const;

export const BOOTSTRAP_RPC_SQL = `
create or replace function public.omnifix_admin_exec_sql(query text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  lowered text := lower(trim(query));
  payload jsonb;
  affected integer := 0;
begin
  if lowered like 'select%' or lowered like 'with%' then
    execute 'select coalesce(jsonb_agg(row_to_json(t)), ''[]''::jsonb) from (' || query || ') t' into payload;
    return jsonb_build_object('ok', true, 'rows', payload, 'rowCount', jsonb_array_length(payload));
  end if;

  execute query;
  get diagnostics affected = row_count;
  return jsonb_build_object('ok', true, 'rows', '[]'::jsonb, 'rowCount', affected);
exception when others then
  return jsonb_build_object('ok', false, 'error', sqlerrm, 'state', sqlstate);
end;
$$;
revoke all on function public.omnifix_admin_exec_sql(text) from public, anon, authenticated;
grant execute on function public.omnifix_admin_exec_sql(text) to service_role;
`;

export const OMNIFIX_SCHEMA_SQL = `
create extension if not exists pgcrypto;

create table if not exists public.omnifix_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null default 'Servicio',
  description text,
  price integer not null default 0,
  old_price integer,
  stock integer not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omnifix_customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text not null default 'Cliente Omnifix',
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omnifix_orders (
  id text primary key,
  customer_email text not null,
  customer_name text,
  status text not null default 'pendiente_pago',
  region text,
  shipping_address text,
  subtotal integer not null default 0,
  iva integer not null default 0,
  shipping integer not null default 0,
  total integer not null default 0,
  currency text not null default 'CLP',
  payment_method text,
  payment_provider text,
  payment_id text,
  preference_id text,
  checkout_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omnifix_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.omnifix_orders(id) on delete cascade,
  product_id text not null,
  name text not null,
  quantity integer not null default 1,
  unit_price integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.omnifix_payments (
  id uuid primary key default gen_random_uuid(),
  order_id text references public.omnifix_orders(id) on delete cascade,
  provider text not null,
  provider_payment_id text,
  provider_preference_id text,
  status text not null default 'pending',
  amount integer not null default 0,
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.omnifix_likes (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  product_id text not null,
  product_name text not null,
  created_at timestamptz not null default now(),
  unique(customer_email, product_id)
);

create table if not exists public.omnifix_comments (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  product_id text not null,
  product_name text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.omnifix_support_messages (
  id uuid primary key default gen_random_uuid(),
  customer_email text not null,
  role text not null check (role in ('cliente','soporte')),
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.omnifix_audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  provider text not null default 'supabase',
  statement_preview text,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.omnifix_products enable row level security;
alter table public.omnifix_customers enable row level security;
alter table public.omnifix_orders enable row level security;
alter table public.omnifix_order_items enable row level security;
alter table public.omnifix_payments enable row level security;
alter table public.omnifix_likes enable row level security;
alter table public.omnifix_comments enable row level security;
alter table public.omnifix_support_messages enable row level security;
alter table public.omnifix_audit_logs enable row level security;

alter publication supabase_realtime add table public.omnifix_orders;
alter publication supabase_realtime add table public.omnifix_order_items;
alter publication supabase_realtime add table public.omnifix_likes;
alter publication supabase_realtime add table public.omnifix_comments;
alter publication supabase_realtime add table public.omnifix_support_messages;
`;

const BLOCKED = ["drop ", "truncate ", "alter role", "alter user", "create role", "copy ", "pg_read_file", "pg_ls_dir", "dblink", "postgres_fdw", "vault.", "auth.users"];

export function getDatabaseConfig() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || "";
  const insforgeUrl = process.env.INSFORGE_URL || process.env.INSFORGE_API_URL || "";
  const insforgeKey = process.env.INSFORGE_API_KEY || process.env.INSFORGE_SERVICE_KEY || "";
  return {
    supabase: { url: supabaseUrl.replace(/\/+$/, ""), hasServiceKey: Boolean(supabaseServiceKey), serviceKey: supabaseServiceKey },
    insforge: { url: insforgeUrl.replace(/\/+$/, ""), hasKey: Boolean(insforgeKey), key: insforgeKey },
    writeEnabled: process.env.DB_CONSOLE_WRITE_ENABLED === "true",
  };
}

export function guardSql(sql: string, mode: SqlMode, confirm?: string) {
  const normalized = sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").trim();
  const lowered = normalized.toLowerCase();
  if (!normalized) return { ok: false, error: "La consulta está vacía." };
  if (normalized.length > 12000) return { ok: false, error: "Consulta demasiado larga. Divide el script en bloques." };
  if (BLOCKED.some((word) => lowered.includes(word))) return { ok: false, error: "Consulta bloqueada por política de seguridad." };
  const readOnly = lowered.startsWith("select") || lowered.startsWith("with");
  if (mode === "read" && !readOnly) return { ok: false, error: "Modo lectura solo acepta SELECT o WITH." };
  if (mode === "write" && confirm !== "EJECUTAR OMNIFIX") return { ok: false, error: "Para escritura debes confirmar con: EJECUTAR OMNIFIX" };
  if (mode === "write" && !getDatabaseConfig().writeEnabled) return { ok: false, error: "La escritura está desactivada. Define DB_CONSOLE_WRITE_ENABLED=true en Vercel." };
  return { ok: true, sql: normalized };
}

async function supabaseRpc(sql: string) {
  const cfg = getDatabaseConfig().supabase;
  if (!cfg.url || !cfg.serviceKey) throw new Error("Faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(`${cfg.url}/rest/v1/rpc/omnifix_admin_exec_sql`, {
      method: "POST",
      headers: { apikey: cfg.serviceKey, Authorization: `Bearer ${cfg.serviceKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: sql }),
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw new Error(data?.message || data?.hint || `Supabase RPC respondió ${res.status}. Instala primero omnifix_admin_exec_sql.`);
    if (data?.ok === false) throw new Error(data.error || "SQL rechazado por la base de datos.");
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function insforgeSql(sql: string) {
  const cfg = getDatabaseConfig().insforge;
  if (!cfg.url || !cfg.key) throw new Error("Faltan INSFORGE_API_URL e INSFORGE_API_KEY.");
  const res = await fetch(`${cfg.url}/sql`, { method: "POST", headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" }, body: JSON.stringify({ query: sql }), cache: "no-store" });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || `Insforge respondió ${res.status}.`);
  return data;
}

export async function runSqlConsole(provider: DatabaseProvider, sql: string, mode: SqlMode, confirm?: string) {
  const guarded = guardSql(sql, mode, confirm);
  if (!guarded.ok) return { ok: false, error: guarded.error, rows: [], rowCount: 0 };
  const startedAt = Date.now();
  const data = provider === "insforge" ? await insforgeSql(guarded.sql || sql) : await supabaseRpc(guarded.sql || sql);
  return { ok: true, provider, rows: data?.rows || data?.data || [], rowCount: data?.rowCount ?? data?.count ?? 0, raw: data, latencyMs: Date.now() - startedAt };
}

export async function inspectDatabase(provider: DatabaseProvider = "supabase") {
  const config = getDatabaseConfig();
  const sql = `select table_name from information_schema.tables where table_schema='public' and table_name like 'omnifix_%' order by table_name`;
  try {
    const result = await runSqlConsole(provider, sql, "read");
    const found = Array.isArray(result.rows) ? result.rows.map((row: { table_name?: string }) => row.table_name).filter(Boolean) : [];
    const missing = REQUIRED_TABLES.filter((table) => !found.includes(table));
    return { ok: true, provider, config: { supabase: { url: Boolean(config.supabase.url), hasServiceKey: config.supabase.hasServiceKey }, insforge: { url: Boolean(config.insforge.url), hasKey: config.insforge.hasKey }, writeEnabled: config.writeEnabled }, found, missing, required: REQUIRED_TABLES, realtime: "polling + Supabase publication" };
  } catch (error) {
    return { ok: false, provider, error: error instanceof Error ? error.message : "No se pudo inspeccionar la base.", config: { supabase: { url: Boolean(config.supabase.url), hasServiceKey: config.supabase.hasServiceKey }, insforge: { url: Boolean(config.insforge.url), hasKey: config.insforge.hasKey }, writeEnabled: config.writeEnabled }, missing: REQUIRED_TABLES, required: REQUIRED_TABLES, bootstrapSql: BOOTSTRAP_RPC_SQL };
  }
}
