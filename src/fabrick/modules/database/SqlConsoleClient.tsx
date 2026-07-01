"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Copy, Database, FileCode2, Loader2, Lock, Play, RefreshCw, ShieldCheck, Table2, TerminalSquare, Zap } from "lucide-react";

type Provider = "supabase" | "insforge";
type Mode = "read" | "write";
type Status = {
  ok?: boolean;
  provider?: Provider;
  error?: string;
  config?: { supabase?: { url: boolean; hasServiceKey: boolean }; insforge?: { url: boolean; hasKey: boolean }; writeEnabled?: boolean };
  found?: string[];
  missing?: string[];
  required?: string[];
  bootstrapSql?: string;
  schemaSql?: string;
};
type Result = { ok?: boolean; error?: string; rows?: unknown[]; rowCount?: number; latencyMs?: number; raw?: unknown; inspectedAt?: string };

const STARTER_SQL = "select table_name from information_schema.tables where table_schema = 'public' order by table_name limit 40";

async function copy(value: string) {
  try { await navigator.clipboard.writeText(value); } catch {}
}

export default function SqlConsoleClient() {
  const [provider, setProvider] = useState<Provider>("supabase");
  const [mode, setMode] = useState<Mode>("read");
  const [sql, setSql] = useState(STARTER_SQL);
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(true);

  const missingCount = status?.missing?.length || 0;
  const canWrite = Boolean(status?.config?.writeEnabled);
  const ready = provider === "supabase" ? Boolean(status?.config?.supabase?.url && status?.config?.supabase?.hasServiceKey) : Boolean(status?.config?.insforge?.url && status?.config?.insforge?.hasKey);

  async function loadStatus() {
    const res = await fetch(`/api/admin/database/sql?provider=${provider}`, { cache: "no-store" });
    const json = (await res.json()) as Status;
    setStatus(json);
  }

  async function run(action?: "install_schema") {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/database/sql", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, mode: action ? "write" : mode, sql, confirm, action }) });
      const json = (await res.json()) as Result;
      setResult(json);
      await loadStatus();
    } catch (error) {
      setResult({ ok: false, error: error instanceof Error ? error.message : "Error al ejecutar." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadStatus(); }, [provider]);
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => void loadStatus(), 6500);
    return () => clearInterval(id);
  }, [live, provider]);

  const resultPreview = useMemo(() => JSON.stringify(result?.rows ?? result?.raw ?? result ?? {}, null, 2), [result]);

  return <main className="min-h-screen bg-[#050816] px-4 py-5 pb-24 text-white md:px-6">
    <section className="mx-auto max-w-7xl space-y-5">
      <header className="overflow-hidden rounded-[2.4rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_12%_0%,rgba(0,245,255,.20),transparent_30rem),linear-gradient(135deg,#07111f,#020617)] p-5 shadow-[0_28px_100px_rgba(0,0,0,.38)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.24em] text-cyan-100"><ShieldCheck className="size-3.5" /> Consola blindada SQL</p><h1 className="mt-5 max-w-3xl text-4xl font-black leading-[.92] tracking-[-.07em] md:text-6xl">Base de datos, tablas y realtime.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Admin protegido para Supabase o Insforge: inspecciona tablas, ejecuta lecturas, crea esquema Omnifix y valida conexión sin exponer claves al navegador.</p></div><div className="grid gap-2 sm:grid-cols-2"><button onClick={() => void loadStatus()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-slate-950"><RefreshCw className="size-4" /> Tester DB</button><button onClick={() => setLive((value) => !value)} className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-5 text-sm font-black ${live ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-50" : "border-white/10 bg-white/[0.05] text-white"}`}><Zap className="size-4" /> {live ? "Realtime ON" : "Realtime OFF"}</button></div></div>
      </header>

      <section className="grid gap-4 md:grid-cols-4"><Metric icon={Database} label="Proveedor" value={provider} /><Metric icon={Lock} label="Credenciales" value={ready ? "listas" : "faltan"} /><Metric icon={Table2} label="Tablas faltantes" value={String(missingCount)} /><Metric icon={ShieldCheck} label="Escritura" value={canWrite ? "activa" : "bloqueada"} /></section>

      <section className="grid gap-5 xl:grid-cols-[1fr_390px]">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2"><button onClick={() => setProvider("supabase")} className={`rounded-2xl px-4 py-2 text-sm font-black ${provider === "supabase" ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-black/25 text-white/65"}`}>Supabase</button><button onClick={() => setProvider("insforge")} className={`rounded-2xl px-4 py-2 text-sm font-black ${provider === "insforge" ? "bg-cyan-300 text-slate-950" : "border border-white/10 bg-black/25 text-white/65"}`}>Insforge</button></div><div className="flex flex-wrap gap-2"><button onClick={() => setMode("read")} className={`rounded-2xl px-4 py-2 text-sm font-black ${mode === "read" ? "bg-white text-slate-950" : "border border-white/10 bg-black/25 text-white/65"}`}>Lectura</button><button onClick={() => setMode("write")} className={`rounded-2xl px-4 py-2 text-sm font-black ${mode === "write" ? "bg-amber-300 text-slate-950" : "border border-white/10 bg-black/25 text-white/65"}`}>Escritura</button></div></div>
          <label className="mt-4 block"><span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.24em] text-cyan-300"><TerminalSquare className="size-4" /> Editor SQL</span><textarea value={sql} onChange={(event) => setSql(event.target.value)} spellCheck={false} className="min-h-[330px] w-full resize-y rounded-[1.5rem] border border-cyan-300/15 bg-[#020617] p-4 font-mono text-sm leading-6 text-cyan-50 outline-none ring-cyan-300/30 placeholder:text-slate-700 focus:ring-2" /></label>
          {mode === "write" ? <label className="mt-3 block rounded-2xl border border-amber-300/20 bg-amber-400/10 p-3"><span className="text-[10px] font-black uppercase tracking-[.2em] text-amber-100">Confirmación requerida</span><input value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="EJECUTAR OMNIFIX" className="mt-2 w-full bg-transparent text-sm font-black text-white outline-none placeholder:text-amber-100/35" /></label> : null}
          <div className="mt-4 flex flex-wrap gap-3"><button onClick={() => void run()} disabled={loading} className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-cyan-300 px-5 text-sm font-black text-slate-950 disabled:opacity-50">{loading ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Ejecutar</button><button onClick={() => { setSql(status?.schemaSql || ""); setMode("write"); setConfirm("EJECUTAR OMNIFIX"); }} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-sm font-black text-white"><FileCode2 className="size-4" /> Cargar esquema</button><button onClick={() => void run("install_schema")} disabled={loading} className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 px-5 text-sm font-black text-emerald-50 disabled:opacity-50"><Table2 className="size-4" /> Crear tablas faltantes</button></div>
        </article>

        <aside className="space-y-4"><Card title="Estado de conexión" icon={Database}><StatusBox status={status} provider={provider} /><div className="grid grid-cols-2 gap-2 text-xs"><Info label="Supabase URL" value={status?.config?.supabase?.url ? "OK" : "Falta"} /><Info label="Service role" value={status?.config?.supabase?.hasServiceKey ? "OK" : "Falta"} /><Info label="Insforge URL" value={status?.config?.insforge?.url ? "OK" : "Opcional"} /><Info label="Insforge key" value={status?.config?.insforge?.hasKey ? "OK" : "Opcional"} /></div></Card><Card title="Tablas requeridas" icon={Table2}><div className="grid gap-2">{(status?.required || []).map((table) => <div key={table} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 p-3 text-sm"><span className="font-bold">{table}</span>{status?.missing?.includes(table) ? <span className="text-amber-200">faltante</span> : <span className="text-emerald-300">ok</span>}</div>)}</div></Card><Card title="Bootstrap RPC" icon={FileCode2}><p className="text-sm leading-6 text-slate-400">Si Supabase dice que falta <b>omnifix_admin_exec_sql</b>, copia este bootstrap y ejecútalo una vez en el SQL Editor de Supabase.</p><button onClick={() => void copy(status?.bootstrapSql || "")} className="mt-3 inline-flex w-full justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-100"><Copy className="mr-2 size-4" /> Copiar bootstrap</button></Card></aside>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 md:p-5"><div className="mb-3 flex items-center justify-between gap-3"><h2 className="text-2xl font-black tracking-[-.04em]">Resultado</h2>{result?.ok ? <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-200"><CheckCircle2 className="size-4" /> OK</span> : result ? <span className="inline-flex items-center gap-2 rounded-full bg-red-400/10 px-3 py-1 text-xs font-black text-red-200"><AlertTriangle className="size-4" /> Error</span> : null}</div>{result?.error ? <div className="rounded-2xl border border-red-300/20 bg-red-500/10 p-4 text-sm text-red-100">{result.error}</div> : null}<pre className="mt-3 max-h-[460px] overflow-auto rounded-[1.5rem] border border-cyan-300/10 bg-[#020617] p-4 text-xs leading-5 text-cyan-50">{result ? resultPreview : "Ejecuta una consulta para ver filas, rowCount, latencia y respuesta cruda."}</pre></section>
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value }: { icon: typeof Database; label: string; value: string }) { return <article className="rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5"><Icon className="mb-4 size-6 text-cyan-300" /><p className="text-sm text-slate-500">{label}</p><b className="mt-1 block text-2xl capitalize">{value}</b></article>; }
function Card({ title, icon: Icon, children }: { title: string; icon: typeof Database; children: React.ReactNode }) { return <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5"><div className="mb-4 flex items-center gap-3"><Icon className="size-5 text-cyan-300" /><h2 className="text-xl font-black tracking-[-.04em]">{title}</h2></div>{children}</article>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-[10px] font-black uppercase tracking-[.18em] text-slate-500">{label}</p><b className="mt-1 block text-white">{value}</b></div>; }
function StatusBox({ status, provider }: { status: Status | null; provider: Provider }) { if (!status) return <p className="text-sm text-slate-500">Leyendo conexión...</p>; return <div className={`mb-3 rounded-2xl border p-4 text-sm leading-6 ${status.ok ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-50" : "border-amber-300/20 bg-amber-400/10 text-amber-50"}`}>{status.ok ? `Conectado a ${provider}.` : status.error || "No se pudo conectar todavía."}</div>; }
