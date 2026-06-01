"use client";

import { useState, type ReactNode } from "react";
import type { BrandTheme } from "../types";
import { BrandLoadingScreen } from "./brand-loading-screen";

type BrandLoadingGateProps = {
  brand: BrandTheme;
  children: ReactNode;
};

export function BrandLoadingGate({ brand, children }: BrandLoadingGateProps) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready ? <BrandLoadingScreen brand={brand} onFinish={() => setReady(true)} /> : null}
      <div className={ready ? "animate-in fade-in duration-500" : "opacity-0"}>{children}</div>
    </>
  );
}
