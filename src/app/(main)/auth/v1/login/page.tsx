import type { Metadata } from "next";
import Link from "next/link";

import { Database, Lock, Radio, ShieldCheck, Sparkles, Store, Waves, Zap } from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export const metadata: Metadata = {
  title: "Acceso Omnifix | Centro de Control",
  description: "Login premium y seguro para el centro de control Omnifix.",
};

export default function LoginV1() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#050816] px-4 py-5 text-white">
      <style>{`@keyframes chromeDrift{0%{transform:translate3d(-8%,0,0) rotate(0deg)}50%{transform:translate3d(6%,-10px,0) rotate(1deg)}100%{transform:translate3d(-8%,0,0) rotate(0deg)}}.chrome-drift{animation:chromeDrift 10s ease-in-out infinite}`}</style>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,245,255,.20),transparent_28rem),radial-gradient(circle_at_88%_8%,rgba(0,82,255,.25),transparent_30rem),linear-gradient(135deg,#050816,#07111f_48%,#020617)]" />
      <div className="chrome-drift pointer-events-none absolute left-[-26%] top-16 h-64 w-[118%] rounded-full bg-white/12 blur-3xl" />
      <div className="chrome-drift pointer-events-none absolute right-[-30%] top-48 h-52 w-[110%] rounded-full bg-[#f4ecd8]/14 blur-3xl [animation-delay:1.2s]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44%] bg-[linear-gradient(180deg,transparent,rgba(244,236,216,.14),rgba(255,255,255,.05))]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl items-center gap-7 lg:grid-cols-[1.04fr_.96fr]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.10] px-4 py-2 text-xs font-black uppercase tracking-widest text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,.25)] backdrop-blur-2xl">
            <Radio className="size-4 text-cyan-200" /> Sistema online · Dashboard activo
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="grid size-28 place-items-center rounded-[2rem] border border-white/20 bg-white/[0.12] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,.35),0_26px_90px_rgba(0,82,255,.20)] backdrop-blur-2xl">
              <OmnifixLogo className="size-24" />
            </div>
            <div>
              <h1 className="text-4xl font-black uppercase tracking-[.16em] text-white md:text-6xl">OMNIFIX</h1>
              <p className="mt-2 text-xs font-black uppercase tracking-[.28em] text-[#f4ecd8]">Todo tiene solución</p>
            </div>
          </div>

          <div>
            <h2 className="max-w-4xl text-5xl font-black leading-[.88] tracking-[-.075em] text-white md:text-7xl">
              Centro de control con acabado cromado translúcido.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
              Admin Omnifix para ventas, tienda, pagos, base de datos SQL, clientes y operación técnica con una entrada más clara y premium.
            </p>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <Feature icon={ShieldCheck} title="Seguro" text="Login y roles" />
            <Feature icon={Database} title="DB" text="Supabase / Insforge" />
            <Feature icon={Waves} title="Live" text="Fondo animado" />
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,.19),rgba(255,255,255,.07)_42%,rgba(244,236,216,.10))] p-3 shadow-[0_32px_120px_rgba(0,0,0,.45)] backdrop-blur-2xl">
          <div className="rounded-[2.1rem] border border-white/15 bg-[#f7f1e3]/95 p-6 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_24px_80px_rgba(244,236,216,.14)] md:p-8">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border border-slate-950/10 bg-white/70 text-slate-950 shadow-[0_14px_44px_rgba(0,0,0,.08)]">
              <Lock className="size-7" />
            </div>
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-black tracking-[-.05em]">Acceso al panel</h3>
              <p className="mx-auto max-w-sm text-sm leading-6 text-slate-600">
                Inicia sesión para entrar a módulos protegidos. La portada del dashboard ya queda disponible en /dashboard/default.
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <LoginForm />
              <GoogleButton className="w-full" variant="outline" />
              <p className="text-center text-xs text-slate-500">
                ¿No tienes cuenta?{" "}
                <Link prefetch={false} href="/auth/v1/register" className="font-black text-blue-700">
                  Crear cuenta
                </Link>
              </p>
            </div>

            <div className="mt-7 grid gap-2 rounded-2xl border border-slate-950/10 bg-white/55 p-4 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,.8)]">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Accesos rápidos</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href="/dashboard/default" className="rounded-xl bg-slate-950 px-3 py-2 text-center text-xs font-black text-white">Dashboard</Link>
                <Link href="/tienda" className="rounded-xl border border-slate-950/10 bg-white px-3 py-2 text-center text-xs font-black text-slate-950">Tienda</Link>
              </div>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
              <Sparkles className="size-4 text-blue-600" /> Omnifix Admin Premium
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof Store; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/12 bg-white/[0.09] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,.18)] backdrop-blur-2xl">
      <Icon className="mb-3 size-6 text-[#f4ecd8]" />
      <p className="text-sm font-black">{title}</p>
      <span className="text-xs text-slate-400">{text}</span>
    </div>
  );
}
