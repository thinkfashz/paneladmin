import { NextResponse } from "next/server";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { BOOTSTRAP_RPC_SQL, OMNIFIX_SCHEMA_SQL, inspectDatabase, runSqlConsole, type DatabaseProvider, type SqlMode } from "@/lib/database/sqlConsole";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Body = { provider?: DatabaseProvider; sql?: string; mode?: SqlMode; confirm?: string; action?: "run" | "install_schema" };

export async function GET(request: Request) {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed) return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  const url = new URL(request.url);
  const provider = (url.searchParams.get("provider") || "supabase") as DatabaseProvider;
  const status = await inspectDatabase(provider);
  return NextResponse.json({ ...status, bootstrapSql: BOOTSTRAP_RPC_SQL, schemaSql: OMNIFIX_SCHEMA_SQL }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Body;
  const provider = body.provider || "supabase";
  const mode = body.mode || "read";
  const sql = body.action === "install_schema" ? OMNIFIX_SCHEMA_SQL : body.sql || "";

  try {
    const result = await runSqlConsole(provider, sql, mode, body.confirm);
    return NextResponse.json({ ...result, inspectedAt: new Date().toISOString() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "No se pudo ejecutar SQL." }, { status: 200, headers: { "Cache-Control": "no-store" } });
  }
}
