import type { Metadata } from "next";

import {
  ArrowRight,
  BadgeCheck,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

export const metadata: Metadata = {
  title: "Tienda Omnifix | Servicio técnico y soluciones digitales",
  description: "Vitrina pública Omnifix para productos, servicios técnicos, cotizaciones rápidas y atención profesional.",
};

const featuredProducts = [
  {
    name: "Diagnóstico técnico express",
    category: "Servicio técnico",
    description: "Revisión inicial para detectar fallas, estado del equipo y mejor ruta de reparación.",
    price: 14990,
    icon: Wrench,
  },
  {
    name: "Mantención notebook pro",
    category: "Computadores",
    description: "Limpieza, optimización, revisión térmica y puesta a punto para equipos lentos.",
    price: 34990,
    icon: PackageCheck,
  },
  {
    name: "Reparación celular premium",
    category: "Móviles",
    description: "Evaluación, cambio de piezas compatibles y entrega guiada para smartphones.",
    price: 44990,
    icon: Smartphone,
  },
  {
    name: "Instalación y configuración",
    category: "Software",
    description: "Configuración de sistema, cuentas, seguridad básica, respaldo y aplicaciones clave.",
    price: 24990,
    icon: Zap,
  },
];

const benefits = [
  "Cotización clara antes de avanzar",
  "Seguimiento del estado del servicio",
  "Atención enfocada en solución real",
  "Vitrina preparada para e-commerce",
];

export default function PublicStorefrontPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative px-4 py-6 md:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_12%,rgba(0,245,255,.18),transparent_28%),radial-gradient(circle_at_88%_0%,rgba(0,82,255,.28),transparent_30%),linear-gradient(135deg,#020617_0%,#06111f_48%,#0f2a62_100%)]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col justify-center gap-12 py-12 lg:grid lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/10 px-4 py-2 font-black text-cyan-100 text-xs uppercase tracking-widest backdrop-blur-xl">
              <ShoppingBag className="size-4 text-cyan-300" /> Tienda pública activa
            </div>

            <div className="flex items-center gap-4">
              <div className="grid size-24 place-items-center rounded-3xl border border-cyan-300/20 bg-white/10 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
                <OmnifixLogo className="size-20" />
              </div>
              <div>
                <h1 className="font-black text-4xl uppercase tracking-widest md:text-6xl">OMNIFIX</h1>
                <p className="mt-2 font-black text-cyan-200 text-xs uppercase tracking-[.34em]">Todo tiene solución</p>
              </div>
            </div>

            <div>
              <h2 className="max-w-4xl font-black text-5xl leading-none tracking-tight md:text-7xl">
                Tienda técnica lista para vender, cotizar y recibir clientes.
              </h2>
              <p className="mt-6 max-w-2xl text-lg text-slate-300 leading-8">
                Portada pública separada del panel administrativo. Los clientes ven productos y servicios; el equipo interno
                entra al admin escribiendo la ruta privada directamente en la URL.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalogo"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white via-cyan-200 to-blue-600 px-6 font-black text-slate-950 text-sm shadow-2xl shadow-blue-600/25 transition hover:scale-[1.01]"
              >
                Ver catálogo <ArrowRight className="size-4" />
              </a>
              <a
                href="#beneficios"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-white/10 px-6 font-black text-sm text-white backdrop-blur-xl transition hover:bg-white/15"
              >
                Cómo funciona <Sparkles className="size-4 text-cyan-200" />
              </a>
            </div>
          </div>

          <div className="rounded-[2.4rem] border border-cyan-300/20 bg-white/[.09] p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black text-cyan-200 text-xs uppercase tracking-widest">Estado tienda</p>
                  <h3 className="mt-2 font-black text-3xl">Online y separada del admin</h3>
                </div>
                <div className="grid size-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                  <ShieldCheck className="size-7" />
                </div>
              </div>

              <div className="mt-7 grid gap-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <BadgeCheck className="size-5 shrink-0 text-cyan-200" />
                    <span className="text-sm text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-black text-2xl text-cyan-100">24/7</p>
                  <p className="mt-1 text-slate-400 text-xs">Vitrina visible</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-black text-2xl text-cyan-100">4</p>
                  <p className="mt-1 text-slate-400 text-xs">Servicios demo</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="font-black text-2xl text-cyan-100">URL</p>
                  <p className="mt-1 text-slate-400 text-xs">Admin privado</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogo" className="relative bg-slate-50 px-4 py-16 text-slate-950 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-black text-blue-700 text-xs uppercase tracking-widest">Catálogo principal</p>
              <h2 className="mt-2 font-black text-4xl tracking-tight md:text-5xl">Productos y servicios destacados</h2>
            </div>
            <p className="max-w-xl text-slate-600 leading-7">
              Este frontend queda como entrada pública. Más adelante puede conectarse al inventario real del admin y al flujo
              de checkout.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const Icon = product.icon;
              return (
                <article
                  key={product.name}
                  className="group flex min-h-[320px] flex-col justify-between rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div>
                    <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      <Icon className="size-7" />
                    </div>
                    <p className="font-black text-blue-700 text-xs uppercase tracking-widest">{product.category}</p>
                    <h3 className="mt-2 font-black text-2xl leading-tight">{product.name}</h3>
                    <p className="mt-3 text-slate-600 text-sm leading-6">{product.description}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between border-slate-100 border-t pt-5">
                    <span className="font-black text-2xl">${product.price.toLocaleString("es-CL")}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 font-bold text-white text-xs">
                      Cotizar <ArrowRight className="size-3" />
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="beneficios" className="bg-white px-4 py-16 text-slate-950 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            { icon: Star, title: "Experiencia premium", text: "Portada moderna con enfoque comercial y visual de marca." },
            { icon: Truck, title: "Flujo de atención", text: "Lista para conectar retiro, despacho, estado de reparación o cotización." },
            { icon: ShieldCheck, title: "Admin separado", text: "El panel queda fuera de la portada pública y protegido por autenticación." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-[2rem] border bg-slate-50 p-6">
                <Icon className="size-8 text-blue-700" />
                <h3 className="mt-5 font-black text-2xl">{item.title}</h3>
                <p className="mt-3 text-slate-600 leading-7">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
