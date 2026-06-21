export function OmnifixLoading({ label = "Cargando Omnifix" }: { label?: string }) {
  return (
    <main className="omnifix-loading-shell">
      <section className="omnifix-loading-card p-8 text-center text-white">
        <div className="mx-auto grid size-20 place-items-center rounded-[1.7rem] border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20">
          <svg viewBox="0 0 500 400" className="size-16 drop-shadow-[0_14px_28px_rgba(0,82,255,.38)]" aria-label="Omnifix">
            <defs>
              <linearGradient id="omniLoaderLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B132B" />
                <stop offset="55%" stopColor="#1C2541" />
                <stop offset="100%" stopColor="#020817" />
              </linearGradient>
              <linearGradient id="omniLoaderRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F5FF" />
                <stop offset="45%" stopColor="#0052FF" />
                <stop offset="100%" stopColor="#05183A" />
              </linearGradient>
              <linearGradient id="omniLoaderBase" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0052FF" />
                <stop offset="52%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#0052FF" />
              </linearGradient>
            </defs>
            <ellipse cx="250" cy="340" rx="150" ry="15" fill="#0052FF" opacity="0.12" />
            <path d="M 235 60 L 140 250 L 250 250 L 215 200 L 175 200 L 235 85 Z" fill="url(#omniLoaderLeft)" />
            <path d="M 235 85 L 215 200 L 250 250 L 235 250 Z" fill="#050C1F" opacity="0.55" />
            <path d="M 255 50 C 265 90 310 180 380 270 L 325 285 C 275 210 245 130 235 70 Z" fill="url(#omniLoaderRight)" />
            <path d="M 252 58 C 260 95 295 170 350 250" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
            <path d="M 140 250 L 325 250 L 305 285 L 142 285 Z" fill="url(#omniLoaderBase)" />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-black uppercase tracking-[.24em] text-white">OMNIFIX</h1>
        <p className="mt-2 text-[10px] font-black uppercase tracking-[.34em] text-cyan-200">Todo tiene solución</p>
        <div className="omnifix-loading-bar mt-7">
          <span />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-slate-300">{label}</p>
      </section>
    </main>
  );
}
