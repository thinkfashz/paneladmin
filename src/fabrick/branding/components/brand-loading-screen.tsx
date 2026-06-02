"use client";

import { useEffect, useState } from "react";

import type { BrandTheme } from "../types";

type BrandLoadingScreenProps = {
  brand: BrandTheme;
  onFinish?: () => void;
};

export function BrandLoadingScreen({ brand, onFinish }: BrandLoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const duration = brand.loading.durationMs || 3000;

  useEffect(() => {
    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const nextProgress = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(timer);
        window.setTimeout(() => onFinish?.(), 250);
      }
    }, 40);

    return () => window.clearInterval(timer);
  }, [duration, onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6"
      style={{
        background: brand.identity.backgroundColor,
        color: brand.identity.textColor,
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border bg-white/80 shadow-sm backdrop-blur">
          {brand.identity.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.identity.logoUrl} alt={brand.identity.name} className="h-14 w-14 object-contain" />
          ) : (
            <span className="font-bold text-3xl" style={{ color: brand.identity.secondaryColor }}>
              {brand.identity.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>

        {brand.loading.showName ? (
          <h1 className="font-semibold text-2xl tracking-tight">{brand.identity.name}</h1>
        ) : null}
        <p className="mt-2 text-sm opacity-70">{brand.loading.message}</p>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: brand.identity.secondaryColor,
            }}
          />
        </div>

        <p className="mt-3 text-xs opacity-60">{progress}%</p>
      </div>
    </div>
  );
}
