import type { Metadata } from "next";
import Link from "next/link";

import { Database, Lock, Radio, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

import { LoginForm } from "../../_components/login-form";
import { GoogleButton } from "../../_components/social-auth/google-button";

export const metadata: Metadata = {
  title: "Acceso Omnifix | Centro de Control",
  description: "Login premium y seguro para el centro de control Omnifix.",
};

export default function LoginV1() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-slate-950 px-4 py-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,245,255,.18),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(0,82,255,.24),transparent_30%)]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 text-cyan-100 text-xs font-black uppercase tracking-widest backdrop-blur-xl">
            <Radio className="size-4 text-cyan-300" /> Sistema online
          </div>

          <div className="flex items-center gap-4">
            <div className="grid size-24 place-items-center rounded-3xl border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
              <OmnifixLogo className="size-20" />
            </div>
            <div>
              <h1 className="font-black text-4xl text-white uppercase tracking-widest md:text-6xl">OMNIFIX</h1>
              <p className="mt-2 text-cyan-200 text-xs font-black uppercase tracking-widest">Todo tiene solución</p>
            </div>
          </div>

          <div>
            <h2 className="max-w-3xl font-black text-5xl text-white leading-none tracking-tight md:text-7xl">
              Centro de control técnico para ventas, clientes y servicios.
            </h2>
            <p className="mt-5 max-w-2xl text-base text-slate-300 leading-8 md:text-lg">
              Panel Omnifix con e-commerce, CRM, Page Engine, métricas, inventario y flujo de atención técnica.
            </p>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <ShieldCheck className="mb-3 size-6 text-cyan-300" />
              <p className="font-black text-sm">Acceso seguro</p>
              <span className="text-slate-400 text-xs">Sesión protegida</span>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <Database className="mb-3 size-6 text-cyan-300" />
              <p className="font-black text-sm">Datos activos</p>
              <span className="text-slate-400 text-xs">Base conectada</span>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
              <Zap className="mb-3 size-6 text-cyan-300" />
              <p className="font-black text-sm">Modo rápido</p>
              <span className="text-slate-400 text-xs">Dashboard fluido</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2.4rem] border border-cyan-300/20 bg-white/[.09] p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl">
          <div className="rounded-[2rem] border bg-background p-6 text-foreground shadow-2xl md:p-8">
            <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl border bg-muted text-primary">
              <Lock className="size-7" />
            </div>
            <div className="space-y-3 text-center">
              <h3 className="font-black text-3xl tracking-tight">Acceso Omnifix</h3>
              <p className="mx-auto max-w-sm text-muted-foreground text-sm leading-6">
                Inicia sesión con credenciales reales. Esta pantalla conserva el diseño premium sin duplicar rutas del App
                Router.
              </p>
            </div>

            <div className="mt-7 space-y-4">
              <LoginForm />
              <GoogleButton className="w-full" variant="outline" />
              <p className="text-center text-muted-foreground text-xs">
                ¿No tienes cuenta?{" "}
                <Link prefetch={false} href="/auth/v1/register" className="font-medium text-primary">
                  Crear cuenta
                </Link>
              </p>
            </div>

            <div className="mt-7 rounded-2xl border bg-muted/50 p-4 text-sm">
              <p className="font-black text-xs uppercase tracking-widest">Estado</p>
              <p className="mt-1 text-muted-foreground">Servidor operativo · Login activo · Dashboard protegido</p>
            </div>

            <p className="mt-5 flex items-center justify-center gap-2 text-muted-foreground text-xs">
              <Sparkles className="size-4 text-primary" /> Omnifix Admin Premium
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
