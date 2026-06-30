"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, BadgeCheck, CreditCard, Loader2, RefreshCw, ShieldCheck, ShoppingBag, Wifi, WifiOff } from "lucide-react";

type OrderRow = {
  id: string;
  estado: string;
  resumen?: { total: number; moneda: "CLP" };
  cliente?: { nombre: string; email: string; telefono?: string };
  paymentMethod?: string;
  preferenceId?: string | null;
  paymentId?: string | null;
  creadoEn?: string;
};

type MpAdminStatus = {
  status?: "ok" | "unconfigured" | "unreachable" | "invalid_token";
  reachable?: boolean;
  latencyMs?: number | null;
  mode?: "production" | "sandbox" | "unknown";
  verifiedMode?: "production" | "sandbox" | "unknown";
  message?: string;
  tokenPrefix?: string;
  account?: { id: string | number | null; email: string | null; nickname: string | null; siteId: string | null; isTestUser: boolean } | null;
  kpis?: { approved: number; pending: number; rejected: number; volume: number; currency: "CLP" };
  recentOrders?: OrderRow[];
  error?: string;
};

function money(value: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value || 0);
}

function statusLabel(status?: string) {
  if (status === "ok") return "Conectado";
  if (status === "invalid_token") return "Token inválido";
  if (status === "unconfigured") return "Sin configurar";
  return "Sin conexión";
}

function statusClass(status?: string) {
  if (status === "ok") return "border-emerald-300/30 bg-emerald-400/10 text-emerald-50";
  if (status === "invalid_token") return "border-red-300/30 bg-red-400/10 text-red-50";
  return "border-cyan-300/20 bg-cyan-300/10 text-cyan-50";
}

export default function MercadoPagoDashboardClient() {
  const [data, setData] = useState<MpAdminStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/payments/mp-status", { cache: "no-store" });
      const json = await response.json() as MpAdminStatus;
      setData(json);
    } catch {
      setData({ status: "unreachable", reachable: false, message: "No se pudo consultar el estado de Mercado Pago." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const kpis = data?.kpis ?? { approved: 0, pending: 0, rejected: 0, volume: 0, currency: "CLP" as const };
  const envRows = useMemo(() => [
    ["MERCADO_PAGO_ACCESS_TOKEN", data?.status === "unconfigured" ? "Pendiente" : "Detectado"],
    ["NEXT_PUBLIC_MP_PUBLIC_KEY", data?.status === "unconfigured" ? "Pendiente" : "Detectado"],
    ["NEXT_PUBLIC_APP_URL", "Recomendado para back_urls"],
  ], [data?.status]);

  return <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 text-foreground md:p-6">
    <section className="overflow-hidden rounded-[2rem] border bg-[radial-gradient(circle_at_16%_0%,rgba(0,245,255,.16),transparent_28rem),linear-gradient(135deg,#07111f,#020617)] p-6 text-white shadow-2xl shadow-black/20 md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.24em] text-cyan-100"><CreditCard className="size-3.5" /> Mercado Pago Omnifix</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[.95] tracking-[-.06em] md:text-6xl">Pasarela conectada al checkout público.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Revisa configuración, modo de operación, cuenta conectada y órdenes creadas desde el checkout Omnifix.</p>
        </div>
        <button onClick={() => void load()} disabled={loading} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-600 px-5 text-sm font-black text-slate-950 disabled:opacity-60">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />} Actualizar
        </button>
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <article className={`rounded-[2rem] border p-5 ${statusClass(data?.status)}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.24em] opacity-70">Estado conexión</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-.04em]">{loading ? "Consultando..." : statusLabel(data?.status)}</h2>
            <p className="mt-3 text-sm leading-6 opacity-75">{data?.message || "Leyendo configuración de Mercado Pago..."}</p>
          </div>
          {data?.reachable ? <Wifi className="size-7 text-emerald-300" /> : <WifiOff className="size-7 text-cyan-200" />}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Metric label="Modo" value={data?.verifiedMode || data?.mode || "unknown"} />
          <Metric label="Latencia" value={data?.latencyMs ? `${data.latencyMs} ms` : "—"} />
          <Metric label="Token" value={data?.tokenPrefix || "—"} />
        </div>
      </article>

      <article className="rounded-[2rem] border bg-card p-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[.24em] text-muted-foreground">Cuenta Mercado Pago</p>
        <h3 className="mt-2 text-2xl font-black tracking-[-.04em]">{data?.account?.nickname || "Cuenta no leída"}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{data?.account?.email || "Configura el token para ver la identidad del vendedor."}</p>
        <div className="mt-5 rounded-2xl border bg-muted/30 p-4 text-sm">
          <b>ID:</b> {data?.account?.id || "—"}<br />
          <b>Site:</b> {data?.account?.siteId || "—"}<br />
          <b>Test user:</b> {data?.account?.isTestUser ? "Sí" : "No / no detectado"}
        </div>
      </article>
    </section>

    <section className="grid gap-4 md:grid-cols-4">
      <MetricCard icon={BadgeCheck} label="Aprobadas" value={String(kpis.approved)} />
      <MetricCard icon={AlertCircle} label="Pendientes" value={String(kpis.pending)} />
      <MetricCard icon={ShieldCheck} label="Rechazadas" value={String(kpis.rejected)} />
      <MetricCard icon={ShoppingBag} label="Volumen" value={money(kpis.volume)} />
    </section>

    <section className="grid gap-4 lg:grid-cols-[420px_1fr]">
      <article className="rounded-[2rem] border bg-card p-5 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-[.24em] text-muted-foreground">Variables necesarias</p>
        <div className="mt-4 grid gap-2">
          {envRows.map(([label, value]) => <div key={label} className="rounded-2xl border bg-muted/30 p-3"><p className="text-xs font-black">{label}</p><p className="mt-1 text-xs text-muted-foreground">{value}</p></div>)}
        </div>
      </article>

      <article className="rounded-[2rem] border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.24em] text-muted-foreground">Órdenes recientes</p><h3 className="mt-1 text-2xl font-black">Checkout Omnifix</h3></div></div>
        <div className="grid gap-2">
          {(data?.recentOrders || []).length ? data?.recentOrders?.map((order) => <div key={order.id} className="grid gap-2 rounded-2xl border bg-muted/25 p-3 text-sm sm:grid-cols-[1fr_auto]"><div><b>{order.id}</b><p className="text-muted-foreground">{order.cliente?.email || "Cliente sin email"} · {order.estado}</p></div><b>{money(order.resumen?.total || 0)}</b></div>) : <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">Aún no hay órdenes en memoria de esta instancia. Cuando el checkout cree órdenes aparecerán aquí.</div>}
        </div>
      </article>
    </section>
  </main>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><p className="text-[10px] font-black uppercase tracking-[.18em] opacity-60">{label}</p><b className="mt-1 block text-lg">{value}</b></div>;
}

function MetricCard({ icon: Icon, label, value }: { icon: typeof BadgeCheck; label: string; value: string }) {
  return <article className="rounded-[1.6rem] border bg-card p-5 shadow-sm"><Icon className="mb-4 size-6 text-cyan-500" /><p className="text-sm text-muted-foreground">{label}</p><b className="mt-1 block text-2xl tracking-[-.04em]">{value}</b></article>;
}
