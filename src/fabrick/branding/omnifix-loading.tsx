import { OmnifixLogo } from "./omnifix-logo";

const loadingSteps = ["Escaneando módulos", "Conectando inventario", "Activando CRM", "Preparando Omnifix Admin"];

export function OmnifixLoading({ label = "Cargando Omnifix" }: { label?: string }) {
  return (
    <main className="omnifix-loading-shell overflow-hidden">
      <section className="omnifix-loading-card relative overflow-hidden p-8 text-center text-white">
        <div className="relative mx-auto grid size-24 place-items-center rounded-3xl border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20">
          <OmnifixLogo className="size-20" />
        </div>
        <h1 className="mt-6 text-3xl font-black uppercase tracking-widest text-white">OMNIFIX</h1>
        <p className="mt-2 text-xs font-black uppercase tracking-widest text-cyan-200">Todo tiene solución</p>
        <div className="omnifix-loading-bar mt-7">
          <span />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-slate-300">{label}</p>
        <div className="mt-6 grid gap-2 text-left">
          {loadingSteps.map((step) => (
            <div key={step} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300">
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
