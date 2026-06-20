export type DashboardMetricSource = "live" | "empty" | "unconfigured" | "error";

export interface DashboardMetricValue {
  value: number;
  formatted: string;
  trend: number;
  trendLabel: string;
  trendDirection: "up" | "down" | "neutral";
  description: string;
  source: DashboardMetricSource;
}

export interface DashboardMetrics {
  totalRevenue: DashboardMetricValue;
  newCustomers: DashboardMetricValue;
  activeAccounts: DashboardMetricValue;
  growthRate: DashboardMetricValue;
  status: {
    ok: boolean;
    source: DashboardMetricSource;
    message: string;
    updatedAt: string;
  };
}

type SqlResult = {
  ok: boolean;
  status: number;
  data: unknown;
  message: string;
};

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function sqlString(value: string | null | undefined) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function getInsForgeConfig() {
  return {
    url: process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL || process.env.INSFORGE_BASE_URL,
    apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY,
  };
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

async function runInsForgeSql(query: string): Promise<SqlResult> {
  const config = getInsForgeConfig();

  if (!config.url || !config.apiKey) {
    return {
      ok: false,
      status: 0,
      data: null,
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
  } catch (error) {
    return {
      ok: false,
      status: 0,
      data: null,
      message: error instanceof Error ? error.message : "No se pudo conectar con InsForge",
    };
  }
}

async function ensureDashboardTables() {
  return runInsForgeSql(`
    create table if not exists public.crm_customers (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      phone text,
      email text,
      status text not null default 'active',
      total_spent numeric not null default 0,
      source text,
      created_at timestamptz not null default now(),
      updated_at timestamptz
    );

    create table if not exists public.ecommerce_orders (
      id uuid primary key default gen_random_uuid(),
      customer_name text,
      customer_phone text,
      customer_email text,
      status text not null default 'pending',
      total_amount numeric not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz
    );

    create table if not exists public.ecommerce_order_items (
      id uuid primary key default gen_random_uuid(),
      order_id uuid references public.ecommerce_orders(id) on delete cascade,
      product_name text not null,
      quantity integer not null default 1,
      unit_price numeric not null default 0,
      created_at timestamptz not null default now()
    );

    create index if not exists crm_customers_created_at_idx on public.crm_customers(created_at);
    create index if not exists crm_customers_status_idx on public.crm_customers(status);
    create index if not exists ecommerce_orders_created_at_idx on public.ecommerce_orders(created_at);
    create index if not exists ecommerce_orders_status_idx on public.ecommerce_orders(status);
  `);
}

async function tableExists(tableName: string) {
  const result = await runInsForgeSql(`select to_regclass(${sqlString(`public.${tableName}`)}) as table_name`);
  if (!result.ok) return false;
  const row = extractRows(result.data)[0];
  return Boolean(row?.table_name);
}

async function singleNumber(query: string, key = "value") {
  const result = await runInsForgeSql(query);
  if (!result.ok) return 0;

  const row = extractRows(result.data)[0];
  const raw = row?.[key];
  const value = typeof raw === "number" ? raw : Number(raw ?? 0);

  return Number.isFinite(value) ? value : 0;
}

async function countIfExists(tableName: string, whereClause = "") {
  if (!(await tableExists(tableName))) return 0;
  return singleNumber(`select count(*)::int as value from public.${tableName} ${whereClause}`);
}

async function sumIfExists(tableName: string, columnName: string, whereClause = "") {
  if (!(await tableExists(tableName))) return 0;
  return singleNumber(`select coalesce(sum(${columnName}), 0)::numeric as value from public.${tableName} ${whereClause}`);
}

function money(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function integer(value: number) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(value);
}

function percent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function metric(input: {
  value: number;
  formatted: string;
  trend: number;
  description: string;
  source: DashboardMetricSource;
}): DashboardMetricValue {
  return {
    value: input.value,
    formatted: input.formatted,
    trend: input.trend,
    trendLabel: percent(input.trend),
    trendDirection: input.trend > 0 ? "up" : input.trend < 0 ? "down" : "neutral",
    description: input.description,
    source: input.source,
  };
}

function trend(current: number, previous: number) {
  if (previous <= 0 && current > 0) return 100;
  if (previous <= 0) return 0;
  return ((current - previous) / previous) * 100;
}

function fallbackMetrics(source: DashboardMetricSource, message: string): DashboardMetrics {
  return {
    totalRevenue: metric({ value: 0, formatted: money(0), trend: 0, description: message, source }),
    newCustomers: metric({ value: 0, formatted: "0", trend: 0, description: message, source }),
    activeAccounts: metric({ value: 0, formatted: "0", trend: 0, description: message, source }),
    growthRate: metric({ value: 0, formatted: "0%", trend: 0, description: message, source }),
    status: {
      ok: source !== "error",
      source,
      message,
      updatedAt: new Date().toISOString(),
    },
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const config = getInsForgeConfig();

  if (!config.url || !config.apiKey) {
    return fallbackMetrics("unconfigured", "Conecta INSFORGE_URL e INSFORGE_API_KEY para activar datos reales.");
  }

  const ensured = await ensureDashboardTables();
  if (!ensured.ok) {
    return fallbackMetrics("error", ensured.message);
  }

  const [
    customerRevenue,
    orderRevenue,
    customers30,
    customersPrev30,
    prospectsTotal,
    prospects30,
    prospectsPrev30,
    customersActive,
    generatedPagesTotal,
    generatedPages30,
    generatedPagesPrev30,
    orders30,
    ordersPrev30,
  ] = await Promise.all([
    sumIfExists("crm_customers", "total_spent", "where status in ('active', 'paid', 'completed')"),
    sumIfExists("ecommerce_orders", "total_amount", "where status in ('paid', 'completed', 'confirmed', 'approved', 'success', 'succeeded')"),
    countIfExists("crm_customers", "where created_at >= now() - interval '30 days'"),
    countIfExists(
      "crm_customers",
      "where created_at >= now() - interval '60 days' and created_at < now() - interval '30 days'",
    ),
    countIfExists("crm_prospects"),
    countIfExists("crm_prospects", "where created_at >= now() - interval '30 days'"),
    countIfExists(
      "crm_prospects",
      "where created_at >= now() - interval '60 days' and created_at < now() - interval '30 days'",
    ),
    countIfExists("crm_customers", "where status in ('active', 'paid', 'completed')"),
    countIfExists("generated_pages"),
    countIfExists("generated_pages", "where created_at >= now() - interval '30 days'"),
    countIfExists(
      "generated_pages",
      "where created_at >= now() - interval '60 days' and created_at < now() - interval '30 days'",
    ),
    countIfExists("ecommerce_orders", "where created_at >= now() - interval '30 days'"),
    countIfExists(
      "ecommerce_orders",
      "where created_at >= now() - interval '60 days' and created_at < now() - interval '30 days'",
    ),
  ]);

  const totalRevenue = customerRevenue + orderRevenue;
  const newCustomers = customers30 + prospects30;
  const previousCustomers = customersPrev30 + prospectsPrev30;
  const activeAccounts = customersActive + prospectsTotal + generatedPagesTotal;
  const currentActivity = customers30 + prospects30 + generatedPages30 + orders30;
  const previousActivity = customersPrev30 + prospectsPrev30 + generatedPagesPrev30 + ordersPrev30;
  const growth = trend(currentActivity, previousActivity);
  const hasLiveData = totalRevenue > 0 || newCustomers > 0 || activeAccounts > 0 || currentActivity > 0;
  const source: DashboardMetricSource = hasLiveData ? "live" : "empty";

  return {
    totalRevenue: metric({
      value: totalRevenue,
      formatted: money(totalRevenue),
      trend: trend(orderRevenue + customerRevenue, customerRevenue || orderRevenue),
      description: hasLiveData ? "Ingresos reales desde clientes y órdenes pagadas" : "Sin órdenes pagadas todavía",
      source,
    }),
    newCustomers: metric({
      value: newCustomers,
      formatted: integer(newCustomers),
      trend: trend(newCustomers, previousCustomers),
      description: "Clientes y prospectos capturados en los últimos 30 días",
      source,
    }),
    activeAccounts: metric({
      value: activeAccounts,
      formatted: integer(activeAccounts),
      trend: trend(activeAccounts, Math.max(0, activeAccounts - newCustomers)),
      description: "Clientes activos, prospectos y páginas generadas",
      source,
    }),
    growthRate: metric({
      value: growth,
      formatted: `${growth.toFixed(1)}%`,
      trend: growth,
      description: "Crecimiento de actividad contra los 30 días anteriores",
      source,
    }),
    status: {
      ok: true,
      source,
      message: hasLiveData ? "Dashboard conectado a InsForge." : "Dashboard conectado, esperando datos reales.",
      updatedAt: new Date().toISOString(),
    },
  };
}
