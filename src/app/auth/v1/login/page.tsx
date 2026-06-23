import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Database, Lock, Radio, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

export const metadata: Metadata = {
  title: "Acceso Omnifix | Centro de Control",
  description: "Acceso visual premium al centro de control Omnifix.",
};

export default function OmnifixAccessPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,245,255,.18),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(0,82,255,.24),transparent_30%)]" />
      <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-100 backdrop-blur-xl">
            <Radio className="size-4 text-cyan-300" /> Sistema online
          </div>
          <div className="flex items-center gap-4">
            <div className="grid size-24 place-items-center rounded-3xl border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
              <OmnifixLogo className="size-20" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-widest text-white md:text-6xl">OMNIFIX</h1>
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-cyan-200">Todo tiene solución</p>
            </div>
          </div>
          <div>
            <h2 className="max-w-3xl text-5xl font-black leading-none tracking-tight text-white md:text-7xl">Centro de control técnico para ventas, clientes y servicios.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">Panel Omnifix con e-commerce, CRM, Page Engine, métricas, inventario y flujo de atención técnica.</p>
          </div>
          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"><ShieldCheck className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Acceso seguro</p><span className="text-xs text-slate-400">Sesión protegida</span></div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"><Database className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Datos activos</p><span className="text-xs text-slate-400">Base conectada</span></div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl"><Zap className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Modo rápido</p><span className="text-xs text-slate-400">Dashboard fluido</span></div>
          </div>
        </div>
        <div className="rounded-[2.4rem] border border-cyan-300/20 bg-white/[.09] p-8 text-center shadow-2xl shadow-blue-950/40 backdrop-blur-2xl">
          <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200"><Lock className="size-7" /></div>
          <h3 className="text-3xl font-black tracking-tight">Acceso Omnifix</h3>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-300">Pantalla personalizada para reemplazar la entrada genérica del dashboard.</p>
          <div className="mt-7 grid gap-3 text-left">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-black uppercase tracking-widest text-cyan-200">Estado</p><p className="mt-1 text-sm text-slate-300">Servidor operativo · Dashboard listo · Módulos Omnifix activos</p></div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs font-black uppercase tracking-widest text-cyan-200">Experiencia</p><p className="mt-1 text-sm text-slate-300">Animación azul, logo premium y superficie visual propia.</p></div>
          </div>
          <Link href="/dashboard/default" className="mt-7 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white via-cyan-200 to-blue-600 text-sm font-black text-slate-950 shadow-2xl shadow-blue-600/20 transition hover:scale-[1.01]">
            Entrar al Centro de Control <ArrowRight className="size-4" />
          </Link>
          <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"><Sparkles className="size-4 text-cyan-200" /> Omnifix Admin Premium</p>
        </div>
      </section>
    </main>
  );
}
