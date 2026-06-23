export function OmnifixLogo({ className = "size-20", showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 500 400" className={`${className} drop-shadow-[0_18px_34px_rgba(0,82,255,.38)]`} aria-label="Omnifix">
        <defs>
          <linearGradient id="omnifixLogoLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="55%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#020817" />
          </linearGradient>
          <linearGradient id="omnifixLogoRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="45%" stopColor="#0052FF" />
            <stop offset="100%" stopColor="#05183A" />
          </linearGradient>
          <linearGradient id="omnifixLogoBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052FF" />
            <stop offset="52%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="340" rx="150" ry="15" fill="#0052FF" opacity="0.12" />
        <path d="M 235 60 L 140 250 L 250 250 L 215 200 L 175 200 L 235 85 Z" fill="url(#omnifixLogoLeft)" />
        <path d="M 235 85 L 215 200 L 250 250 L 235 250 Z" fill="#050C1F" opacity="0.55" />
        <path d="M 255 50 C 265 90 310 180 380 270 L 325 285 C 275 210 245 130 235 70 Z" fill="url(#omnifixLogoRight)" />
        <path d="M 252 58 C 260 95 295 170 350 250" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M 140 250 L 325 250 L 305 285 L 142 285 Z" fill="url(#omnifixLogoBase)" />
      </svg>
      {showText ? (
        <div className="leading-none">
          <strong className="block text-3xl font-black uppercase tracking-[.22em] text-white">OMNIFIX</strong>
          <span className="mt-2 block text-[10px] font-black uppercase tracking-[.38em] text-cyan-200">Todo tiene solución</span>
        </div>
      ) : null}
    </div>
  );
}
