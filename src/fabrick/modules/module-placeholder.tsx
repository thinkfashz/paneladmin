import Link from "next/link";

import { ArrowLeft, Construction, FileWarning, ListChecks, Sparkles } from "lucide-react";

type ModulePlaceholderProps = {
  section: "admin" | "dashboard";
  segments?: string[];
};

export function ModulePlaceholder({ section, segments = [] }: ModulePlaceholderProps) {
  const requestedPath = `/${section}${segments.length ? `/${segments.join("/")}` : ""}`;
  const fallbackHome = section === "admin" ? "/admin" : "/dashboard/default";

  return (
    <main className="grid min-h-[calc(100vh-3rem)] place-items-center text-white">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[.08] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl md:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent" />
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="grid size-16 shrink-0 place-items-center rounded-3xl border border-rose-200/20 bg-rose-300/10 text-rose-100 shadow-2xl shadow-rose-500/20">
            <Construction className="size-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 font-black text-[11px] text-rose-100 uppercase tracking-widest">
              <FileWarning className="size-3.5" /> Módulo pendiente
            </div>
            <h1 className="mt-5 font-black text-4xl leading-tight tracking-tight md:text-5xl">
              Falta añadir o completar esta página
            </h1>
            <p className="mt-4 text-rose-50/75 leading-7">
              La ruta existe como intención de módulo, pero todavía no tiene pantalla final conectada. No se envía al login:
              se muestra este estado para que puedas completar la página sin romper la navegación.
            </p>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="font-black text-[11px] text-rose-100/70 uppercase tracking-widest">Ruta solicitada</p>
              <code className="mt-2 block break-all rounded-xl bg-black/30 px-3 py-2 font-mono text-rose-50 text-sm">
                {requestedPath}
              </code>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <ListChecks className="mb-3 size-5 text-emerald-300" />
                <p className="font-bold text-sm">Siguiente paso</p>
                <p className="mt-1 text-rose-50/65 text-sm">Crear el archivo page.tsx del módulo o conectar su componente real.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
                <Sparkles className="mb-3 size-5 text-rose-200" />
                <p className="font-bold text-sm">Estado seguro</p>
                <p className="mt-1 text-rose-50/65 text-sm">La sesión sigue activa y el panel no pierde contexto.</p>
              </div>
            </div>

            <Link
              href={fallbackHome}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 font-black text-slate-950 text-sm shadow-2xl shadow-white/10 transition hover:scale-[1.01]"
            >
              <ArrowLeft className="size-4" /> Volver al panel
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
