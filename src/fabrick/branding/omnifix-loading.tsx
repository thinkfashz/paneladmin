import { OmnifixLogo } from "./omnifix-logo";

const loadingSteps = ["Escaneando módulos", "Conectando inventario", "Activando CRM", "Preparando Omnifix Admin"];

type OmnifixLoadingProps = {
  label?: string;
  description?: string;
  compact?: boolean;
};

export function OmnifixLoading({ label = "Cargando Omnifix", description, compact = false }: OmnifixLoadingProps) {
  if (compact) {
    return (
      <span className="inline-flex items-center justify-center gap-2" role="status" aria-live="polite">
        <span className="relative grid size-7 place-items-center">
          <span className="absolute size-7 animate-spin rounded-full border border-cyan-200/30 border-t-cyan-200" />
          <span className="relative grid size-5 place-items-center rounded-lg bg-slate-950/80 shadow-lg shadow-blue-500/20">
            <OmnifixLogo className="size-4" />
          </span>
        </span>
        <span>{label}</span>
        <span className="sr-only">Cargando</span>
      </span>
    );
  }

  return (
    <main className="omnifix-loading-shell overflow-hidden">
      <section className="omnifix-loading-card relative overflow-hidden p-8 text-center text-white">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
        <div className="relative mx-auto grid size-28 place-items-center rounded-[2rem] border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20">
          <div className="absolute size-32 animate-ping rounded-full bg-cyan-300/10" />
          <div className="absolute size-32 animate-spin rounded-full border border-cyan-300/20 border-t-cyan-200" />
          <OmnifixLogo className="relative size-20" />
        </div>
        <h1 className="mt-6 font-black text-3xl text-white uppercase tracking-widest">OMNIFIX</h1>
        <p className="mt-2 font-black text-cyan-200 text-xs uppercase tracking-widest">Todo tiene solución</p>
        <div className="omnifix-loading-bar mt-7">
          <span />
        </div>
        <p className="mt-5 font-semibold text-slate-300 text-xs uppercase tracking-widest">{label}</p>
        {description ? <p className="mx-auto mt-2 max-w-xs text-slate-400 text-xs leading-5">{description}</p> : null}
        <div className="mt-6 grid gap-2 text-left">
          {loadingSteps.map((step) => (
            <div
              key={step}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-bold text-slate-300 text-xs"
            >
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-cyan-300" />
                {step}
              </span>
              <span className="font-mono text-cyan-200">online</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
