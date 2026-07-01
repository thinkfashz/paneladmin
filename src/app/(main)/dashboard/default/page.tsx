import Link from "next/link";
import { ArrowRight, BadgeCheck, CreditCard, Database, Lock, Package, ShieldCheck, ShoppingBag, Sparkles, Store, Users, WandSparkles } from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";
import { ADMIN_MODULES } from "@/fabrick/navigation/admin-modules";

export const dynamic = "force-dynamic";

const featured = [
  { href: "/admin/database/sql", label: "Base de datos", text: "SQL blindado, Supabase / Insforge, tablas y tester realtime.", icon: Database },
  { href: "/admin/pagos/mercadopago", label: "Pagos", text: "Mercado Pago, sandbox, preferencias y órdenes recientes.", icon: CreditCard },
  { href: "/admin/e-commerce", label: "E-commerce", text: "Vitrina, catálogo, carrito y checkout Omnifix.", icon: Store },
  { href: "/admin/productos", label: "Productos", text: "Catálogo, precios, stock y servicios activos.", icon: Package },
];

export default function DashboardDefaultPage() {
  const modules = ADMIN_MODULES.filter((module) => module.href !== "/admin");

  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_0%,rgba(0,245,255,.20),transparent_28rem),radial-gradient(circle_at_84%_6%,rgba(0,82,255,.24),transparent_30rem),linear-gradient(135deg,#050816,#07111f_48%,#020617)]" />
        <div className="absolute left-[-18%] top-20 h-64 w-[80%] rounded-full bg-cyan-200/10 blur-3xl" />
        <div className="absolute right-[-20%] top-44 h-72 w-[92%] rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,transparent,rgba(244,236,216,.12),rgba(255,255,255,.06))]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 pb-24 md:px-6 md:py-8">
        <header className="relative overflow-hidden rounded-[2.6rem] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.06)_38%,rgba(0,82,255,.10))] p-5 shadow-[0_36px_120px_rgba(0,0,0,.48)] backdrop-blur-2xl md:p-8">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-64 w-[65%] rounded-full bg-[#f4ecd8]/15 blur-3xl" />
          <div className="relative z-10 grid gap-7 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-[2rem] border border-white/20 bg-white/12 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_24px_80px_rgba(0,82,255,.20)] backdrop-blur-2xl">
                  <OmnifixLogo showText className="h-24 w-auto sm:h-28" />
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-200/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.24em] text-cyan-50">
                  <BadgeCheck className="size-3.5" /> Dashboard listo
                </span>
              </div>
              <p className="mt-8 text-sm font-black uppercase tracking-[.22em] text-[#f4ecd8]">Panel Omnifix · acceso principal</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[.9] tracking-[-.075em] text-white md:text-6xl lg:text-7xl">
                Control técnico con acabado cromado y operación rápida.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200/80 md:text-base">
                Esta portada queda accesible para entrar al sistema. Los módulos sensibles siguen protegidos por login y roles.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/auth/v1/login" className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#f4ecd8] px-5 text-sm font-black text-slate-950 shadow-[0_18px_60px_rgba(244,236,216,.18)]">
                  <Lock className="size-4" /> Entrar con credenciales
                </Link>
                <Link href="/tienda" className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur-xl">
                  <ShoppingBag className="size-4" /> Ver tienda
                </Link>
              </div>
            </div>

            <div className="rounded-[2.1rem] border border-white/15 bg-white/[0.10] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_24px_70px_rgba(0,0,0,.28)] backdrop-blur-2xl">
              <Sparkles className="mb-4 size-7 text-[#f4ecd8]" />
              <h2 className="text-2xl font-black tracking-[-.04em]">Estado del acceso</h2>
              <div className="mt-4 grid gap-2">
                <Status text="/dashboard/default disponible" />
                <Status text="/admin protegido" />
                <Status text="DB y pagos con auth" />
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {featured.map(({ href, label, text, icon: Icon }) => (
            <Link key={href} href={href} className="group rounded-[1.8rem] border border-white/12 bg-white/[0.075] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.11]">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#f4ecd8] text-slate-950 shadow-[0_14px_40px_rgba(244,236,216,.16)]">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-[-.04em]">{label}</h3>
              <p className="mt-2 min-h-[3.8rem] text-sm leading-6 text-slate-300">{text}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-black text-cyan-100">Abrir <ArrowRight className="size-4 transition group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[.28em] text-cyan-300">Módulos</p>
                <h2 className="mt-2 text-3xl font-black tracking-[-.055em]">Centro de operación.</h2>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link key={module.href} href={module.href} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4 transition hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[0.06]">
                    <Icon className="mb-3 size-5 text-cyan-300" />
                    <b className="block text-sm">{module.shortLabel}</b>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{module.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="space-y-4">
            <article className="rounded-[2rem] border border-white/12 bg-[#f4ecd8] p-5 text-slate-950 shadow-[0_24px_80px_rgba(244,236,216,.12)]">
              <ShieldCheck className="mb-4 size-6" />
              <h3 className="text-2xl font-black tracking-[-.04em]">Acceso protegido</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">Si no puedes entrar, primero inicia sesión. Si el login falla, falta configurar proveedor auth, usuario o variables de sesión.</p>
              <Link href="/auth/v1/login" className="mt-4 inline-flex w-full justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Ir al login</Link>
            </article>

            <article className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
              <WandSparkles className="mb-4 size-6 text-cyan-300" />
              <h3 className="text-2xl font-black tracking-[-.04em]">Diseño actualizado</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">Azul profundo, negro, blanco cromado translúcido y crema semirreal para una entrada más premium.</p>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}

function Status({ text }: { text: string }) {
  return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200"><ShieldCheck className="size-4 shrink-0 text-cyan-200" /><span>{text}</span></div>;
}
