"use client";

import { Globe } from "./globe";

export function GlobeDemo() {
  return (
    <div className="relative flex min-h-[620px] items-center justify-center overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top,#1d4ed8_0%,#020617_42%,#000_100%)] p-8 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />

      <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-200">
            Fabrick Global Demo
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Visualiza clientes, rutas y prospectos en un globo interactivo.
          </h1>
          <p className="mt-5 max-w-xl text-blue-100/80">
            Este componente usa Cobe, canvas y React. Sirve como ejemplo de componente avanzado guardable y reutilizable.
          </p>
        </div>

        <Globe
          className="mx-auto w-full max-w-[520px]"
          dark={1}
          baseColor={[0.05, 0.08, 0.15]}
          markerColor={[1, 0.55, 0.1]}
          arcColor={[0.3, 0.7, 1]}
          glowColor={[0.1, 0.2, 0.55]}
          mapBrightness={5}
          markers={[
            { id: "scl", location: [-33.4489, -70.6693], label: "Santiago" },
            { id: "lin", location: [-35.8467, -71.5931], label: "Linares" },
            { id: "tal", location: [-35.4264, -71.6554], label: "Talca" },
            { id: "cal", location: [3.4516, -76.532], label: "Cali" },
          ]}
          arcs={[
            {
              id: "scl-lin",
              from: [-33.4489, -70.6693],
              to: [-35.8467, -71.5931],
              label: "Ruta Cliente",
            },
            {
              id: "cal-scl",
              from: [3.4516, -76.532],
              to: [-33.4489, -70.6693],
              label: "Origen",
            },
          ]}
        />
      </div>
    </div>
  );
}
