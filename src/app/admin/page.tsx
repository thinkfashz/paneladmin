import { redirect } from "next/navigation";
import Link from "next/link";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  ShieldCheck,
  Sparkles,
  Store,
  Zap,
} from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";
import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { ADMIN_MODULES } from "@/fabrick/navigation/admin-modules";

export const dynamic = "force-dynamic";

const priorityHrefs = ["/admin/database/sql", "/admin/pagos/mercadopago", "/admin/e-commerce", "/admin/productos"];

export default async function AdminHomePage() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed || !auth.businessId) redirect("/auth/v1/login");

  const now = new Date();
  const dia = now.getDate();
  const hora = now.getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const mesNombre = now.toLocaleString("es-CL", { month: "long", year: "numeric" });
  const diasF29 = 12 - dia;
  const f29Urgente = dia >= 8 && dia <= 11;
  const f29Vencido = dia > 12;
  const databaseModule = ADMIN_MODULES.find((module) => module.href === "/admin/database/sql");
  const priorityModules = priorityHrefs
    .map((href) => ADMIN_MODULES.find((module) => module.href === href))
    .filter(Boolean) as typeof ADMIN_MODULES[number][];
  const restModules = ADMIN_MODULES.filter((module) => module.href !== "/admin" && !priorityHrefs.includes(module.href));

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 pb-24 md:px-6 md:py-8">
        <section className="relative overflow-hidden rounded-[2.6rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_15%_0%,rgba(0,245,255,.22),transparent_30rem),radial-gradient(circle_at_88%_12%,rgba(0,82,255,.26),transparent_28rem),linear-gradient(135deg,#07111f,#020617)] p-5 shadow-[0_32px_110px_rgba(0,0,0,.45)] md:p-8">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="absolute -bottom-32 left-10 h-72 w-[70%] rounded-full bg-blue-600/12 blur-3xl" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_370px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <OmnifixLogo showText className="h-24 w-auto sm:h-28" />
                <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.24em] text-cyan-100">
                  Admin operativo
                </div>
              </div>
              <p className="mt-8 text-sm font-black uppercase tracking-[.22em] text-cyan-200">{saludo} · {mesNombre}</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[.9] tracking-[-.075em] md:text-6xl lg:text-7xl">
                Dashboard Omnifix claro, rápido y conectado.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                Entra directo a tienda, pagos, productos y base de datos. La consola SQL queda visible para crear tablas, probar conexión y revisar el esquema del sistema.
              </p>
            </div>

            <div className="grid gap-3">
              <Link href="/admin/database/sql" className="group rounded-[2rem] border border-cyan-300/25 bg-cyan-300/10 p-5 shadow-[0_20px_70px_rgba(0,82,255,.18)] transition hover:-translate-y-1 hover:bg-cyan-300/15">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-13 place-items-center rounded-2xl bg-cyan-300 text-slate-950">
                    <Database className="size-7" />
                  </div>
                  <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-[10px] font-black uppercase tracking-[.18em] text-emerald-200">Nuevo</span>
                </div>
                <h2 className="mt-5 text-2xl font-black tracking-[-.04em]">Base de datos SQL</h2>
                <p className="mt-2 text-sm leading-6 text-cyan-50/70">Consola blindada para Supabase o Insforge, tester, tablas faltantes y realtime.</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-black text-cyan-100">Abrir consola <ArrowRight className="size-4 transition group-hover:translate-x-1" /></div>
              </Link>

              <div className="grid grid-cols-3 gap-2 text-center">
                <MiniStat label="Módulos" value={String(ADMIN_MODULES.length - 1)} />
                <MiniStat label="DB" value="SQL" />
                <MiniStat label="Modo" value="Live" />
              </div>
            </div>
          </div>
        </section>

        {(f29Urgente || f29Vencido) ? (
          <Link href="/admin/contabilidad" className={`flex items-center gap-3 rounded-[1.4rem] border p-4 transition hover:bg-white/[0.05] ${f29Vencido ? "border-red-400/30 bg-red-500/10 text-red-100" : "border-amber-300/30 bg-amber-400/10 text-amber-50"}`}>
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-black">
              {f29Vencido ? "F29 vencido — declara ahora para evitar multa" : `F29: quedan ${diasF29} día${diasF29 === 1 ? "" : "s"} — ir al módulo contable`}
            </p>
            <ArrowRight className="ml-auto size-4" />
          </Link>
        ) : (
          <div className="flex items-center gap-3 rounded-[1.4rem] border border-emerald-300/25 bg-emerald-400/10 p-4 text-emerald-50">
            <CheckCircle2 className="size-5 shrink-0" />
            <p className="text-sm font-black">{dia <= 12 ? `F29 al día — vence el día 12, quedan ${diasF29} días` : "F29 declarado este período"}</p>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <Kpi icon={Store} label="Tienda" value="Activa" href="/tienda" />
          <Kpi icon={ShieldCheck} label="Pagos" value="MP" href="/admin/pagos/mercadopago" />
          <Kpi icon={Database} label="Base de datos" value="Tester" href="/admin/database/sql" />
          <Kpi icon={Clock3} label="Período" value={mesNombre} href="/admin/contabilidad" />
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.28em] text-cyan-300">Accesos prioritarios</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-.055em]">Lo más importante primero.</h2>
            </div>
            <Link href="/admin/database/sql" className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100">
              <Database className="size-4" /> Abrir DB
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {priorityModules.map((module) => <ModuleCard key={module.href} module={module} priority />)}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.28em] text-slate-500">Todos los módulos</p>
                <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">Operación Omnifix</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {restModules.map((module) => <ModuleCard key={module.href} module={module} />)}
            </div>
          </div>

          <aside className="space-y-4">
            <article className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-5">
              <Sparkles className="mb-4 size-6 text-cyan-300" />
              <h3 className="text-2xl font-black tracking-[-.04em]">Checklist técnico</h3>
              <div className="mt-5 grid gap-3">
                <CheckRow text="Consola SQL visible en dashboard" />
                <CheckRow text="Crear tablas faltantes desde admin" />
                <CheckRow text="Tester Supabase / Insforge" />
                <CheckRow text="Mercado Pago solo en admin" />
              </div>
            </article>

            {databaseModule ? (
              <Link href={databaseModule.href} className="block rounded-[2rem] border border-cyan-300/20 bg-[radial-gradient(circle_at_top,rgba(0,245,255,.18),transparent_65%),rgba(255,255,255,.04)] p-5 transition hover:-translate-y-1">
                <Zap className="mb-4 size-6 text-cyan-300" />
                <p className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-300">Siguiente paso</p>
                <h3 className="mt-2 text-2xl font-black tracking-[-.04em]">Configurar base real</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">Pega variables en Vercel, instala bootstrap RPC y crea el esquema Omnifix.</p>
              </Link>
            ) : null}
          </aside>
        </section>
      </section>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 backdrop-blur-xl">
      <b className="block text-lg text-cyan-100">{value}</b>
      <span className="mt-1 block text-[10px] font-black uppercase tracking-[.16em] text-slate-500">{label}</span>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, href }: { icon: typeof Store; label: string; value: string; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.055]">
      <Icon className="mb-4 size-6 text-cyan-300" />
      <p className="text-sm text-slate-500">{label}</p>
      <b className="mt-1 block truncate text-2xl tracking-[-.04em] text-white">{value}</b>
    </Link>
  );
}

function ModuleCard({ module, priority = false }: { module: typeof ADMIN_MODULES[number]; priority?: boolean }) {
  const Icon = module.icon;
  return (
    <Link href={module.href} className={`group relative overflow-hidden rounded-[1.7rem] border p-5 transition hover:-translate-y-1 ${priority ? "border-cyan-300/25 bg-[radial-gradient(circle_at_20%_0%,rgba(0,245,255,.16),transparent_18rem),rgba(255,255,255,.055)] shadow-[0_18px_70px_rgba(0,82,255,.12)]" : "border-white/10 bg-white/[0.035] hover:border-cyan-300/25 hover:bg-white/[0.055]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`grid size-12 place-items-center rounded-2xl ${priority ? "bg-cyan-300 text-slate-950" : "bg-white/[0.08] text-cyan-300"}`}>
          <Icon className="size-6" />
        </div>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.16em] text-slate-400">Activo</span>
      </div>
      <h3 className="mt-5 text-lg font-black leading-tight tracking-[-.035em] text-white">{module.label}</h3>
      <p className="mt-2 min-h-[2.7rem] text-sm leading-6 text-slate-500">{module.description}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-black text-cyan-200">Abrir <ArrowRight className="size-4 transition group-hover:translate-x-1" /></div>
    </Link>
  );
}

function CheckRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-slate-300">
      <CheckCircle2 className="size-4 shrink-0 text-emerald-300" />
      <span>{text}</span>
    </div>
  );
}
