import { randomBytes } from "crypto";

import type { GeneratedPage, GeneratedPageContentType } from "../types";
import { buildHtmlPreviewDocument, buildReactDemoHtml } from "./preview-engine";

export { buildHtmlPreviewDocument, buildReactDemoHtml } from "./preview-engine";

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function sqlString(value: string | null | undefined) {
  if (value === null || value === undefined) return "null";
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

export function createPublicToken() {
  return randomBytes(8).toString("hex");
}

export async function ensureGeneratedPagesTable() {
  const query = `
    create table if not exists public.generated_pages (
      id uuid primary key default gen_random_uuid(),
      token text not null unique,
      title text not null,
      client_name text,
      niche text,
      html text not null,
      react_code text,
      css text,
      content_type text not null default 'html',
      status text not null default 'published',
      created_at timestamptz not null default now(),
      updated_at timestamptz
    );

    alter table public.generated_pages add column if not exists react_code text;
    alter table public.generated_pages add column if not exists css text;
    alter table public.generated_pages add column if not exists content_type text not null default 'html';

    create index if not exists generated_pages_token_idx on public.generated_pages(token);
    create index if not exists generated_pages_status_idx on public.generated_pages(status);
    create index if not exists generated_pages_content_type_idx on public.generated_pages(content_type);
  `;

  return runInsForgeSql(query);
}

export async function createGeneratedPage(input: {
  title: string;
  clientName?: string;
  niche?: string;
  html?: string;
  reactCode?: string;
  css?: string;
  contentType: GeneratedPageContentType;
}) {
  await ensureGeneratedPagesTable();

  const token = createPublicToken();
  const html =
    input.contentType === "react"
      ? buildReactDemoHtml(input.reactCode || "", input.css || "")
      : buildHtmlPreviewDocument(input.html || "");

  const query = `
    insert into public.generated_pages (
      token,
      title,
      client_name,
      niche,
      html,
      react_code,
      css,
      content_type,
      status
    )
    values (
      ${sqlString(token)},
      ${sqlString(input.title)},
      ${sqlString(input.clientName || null)},
      ${sqlString(input.niche || null)},
      ${sqlString(html)},
      ${sqlString(input.reactCode || null)},
      ${sqlString(input.css || null)},
      ${sqlString(input.contentType)},
      'published'
    )
    returning id, token, title, client_name, niche, html, react_code, css, content_type, status, created_at, updated_at
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      page: null,
    };
  }

  const row = extractRows(result.data)[0];

  if (!row) {
    return {
      ok: false,
      message: "La página fue creada, pero no se pudo leer el resultado.",
      page: null,
    };
  }

  return {
    ok: true,
    message: "Demo creada correctamente.",
    page: mapGeneratedPage(row),
  };
}

export async function listGeneratedPages() {
  await ensureGeneratedPagesTable();

  const query = `
    select id, token, title, client_name, niche, html, react_code, css, content_type, status, created_at, updated_at
    from public.generated_pages
    order by created_at desc
    limit 20
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
      pages: [] as GeneratedPage[],
    };
  }

  return {
    ok: true,
    message: "OK",
    pages: extractRows(result.data).map(mapGeneratedPage),
  };
}

export async function deleteGeneratedPageByToken(token: string) {
  await ensureGeneratedPagesTable();

  const query = `
    delete from public.generated_pages
    where token = ${sqlString(token)}
    returning id, token
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  return {
    ok: true,
    message: "Demo eliminada correctamente.",
  };
}

export async function getGeneratedPageByToken(token: string) {
  const query = `
    select id, token, title, client_name, niche, html, react_code, css, content_type, status, created_at, updated_at
    from public.generated_pages
    where token = ${sqlString(token)}
    and status = 'published'
    limit 1
  `;

  const result = await runInsForgeSql(query);

  if (!result.ok) return null;

  const row = extractRows(result.data)[0];
  if (!row) return null;

  return mapGeneratedPage(row);
}

function mapGeneratedPage(row: Record<string, unknown>): GeneratedPage {
  return {
    id: String(row.id ?? ""),
    token: String(row.token ?? ""),
    title: String(row.title ?? "Página sin título"),
    clientName: row.client_name ? String(row.client_name) : null,
    niche: row.niche ? String(row.niche) : null,
    html: String(row.html ?? ""),
    reactCode: row.react_code ? String(row.react_code) : null,
    css: row.css ? String(row.css) : null,
    contentType: String(row.content_type ?? "html") as GeneratedPage["contentType"],
    status: String(row.status ?? "published") as GeneratedPage["status"],
    createdAt: String(row.created_at ?? ""),
    updatedAt: row.updated_at ? String(row.updated_at) : null,
  };
}
