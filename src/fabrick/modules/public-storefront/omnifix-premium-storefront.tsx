"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Cpu,
  Headphones,
  Laptop,
  LogIn,
  Menu,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { OmnifixLogo } from "@/fabrick/branding/omnifix-logo";

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  rating: number;
  delivery: string;
  image: string;
  icon: LucideIcon;
  features: string[];
};

const products: Product[] = [
  { id: "diagnostico-express", name: "Diagnóstico técnico express", category: "Servicio técnico", description: "Revisión inicial, informe de falla, ruta de reparación y presupuesto antes de avanzar.", price: 14990, stock: 18, rating: 5, delivery: "Atención rápida", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop", icon: Wrench, features: ["Informe claro", "Cotización guiada"] },
  { id: "mantencion-notebook-pro", name: "Mantención notebook pro", category: "Computadores", description: "Limpieza interna, revisión térmica, optimización y puesta a punto para equipos lentos.", price: 34990, oldPrice: 42990, stock: 9, rating: 4.9, delivery: "Entrega 24-48h", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop", icon: Laptop, features: ["Temperatura", "Optimización"] },
  { id: "reparacion-celular-premium", name: "Reparación celular premium", category: "Móviles", description: "Evaluación, cambio de piezas compatibles y entrega guiada para smartphones.", price: 44990, stock: 7, rating: 4.8, delivery: "Según repuesto", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop", icon: Smartphone, features: ["Pantallas", "Baterías"] },
  { id: "instalacion-configuracion", name: "Instalación y configuración", category: "Software", description: "Configuración de sistema, cuentas, seguridad básica, respaldo y aplicaciones clave.", price: 24990, stock: 12, rating: 5, delivery: "Remoto o local", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop", icon: Zap, features: ["Cuentas", "Seguridad"] },
  { id: "pack-seguridad-digital", name: "Pack seguridad digital", category: "Seguridad", description: "Protección básica, respaldo, revisión de accesos y recomendaciones para evitar pérdidas.", price: 29990, stock: 6, rating: 4.9, delivery: "Mismo día", image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1200&auto=format&fit=crop", icon: ShieldCheck, features: ["Backup", "Accesos"] },
  { id: "soporte-remoto-guiado", name: "Soporte remoto guiado", category: "Soporte", description: "Sesión de asistencia para resolver problemas, configurar herramientas o dejar tu equipo listo.", price: 19990, stock: 20, rating: 4.8, delivery: "Online", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", icon: Headphones, features: ["Videollamada", "Paso a paso"] },
];

const benefits = [
  { icon: ShieldCheck, title: "Compra protegida", text: "Cotización clara, orden registrada y seguimiento del servicio." },
  { icon: Truck, title: "Retiro o despacho", text: "Coordina entrega, retiro o atención presencial según el caso." },
  { icon: Cpu, title: "Admin separado", text: "La vitrina es pública y el panel interno queda protegido por acceso privado." },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

function checkoutHref(product: Product) {
  const params = new URLSearchParams({ productId: product.id, name: product.name, price: String(product.price), img: product.image, category: product.category });
  return `/checkout?${params.toString()}`;
}

function saveCheckoutProduct(product: Product) {
  try {
    sessionStorage.setItem("omnifix-checkout-cart-v1", JSON.stringify([{ product: { id: product.id, name: product.name, price: product.price, image_url: product.image, category_id: product.category }, quantity: 1 }]));
  } catch {}
}

function OmnifixWordmark() {
  return <div className="flex min-w-0 items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-white/[0.08] p-1.5 shadow-[0_14px_44px_rgba(0,82,255,.28)] backdrop-blur-xl"><OmnifixLogo className="size-10" /></div><div className="min-w-0"><strong className="block truncate font-black text-sm uppercase tracking-[.28em] text-white">Omnifix</strong><span className="mt-1 block truncate font-black text-[9px] uppercase tracking-[.34em] text-cyan-200">Todo tiene solución</span></div></div>;
}

function ProductCard({ product }: { product: Product }) {
  const Icon = product.icon;
  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  const stockLabel = product.stock <= 3 ? `Crítico · ${product.stock}` : product.stock <= 10 ? `Bajo · ${product.stock}` : `Disponible · ${product.stock}`;

  return <article className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_18%_0%,rgba(0,245,255,.12),transparent_16rem),linear-gradient(180deg,#101827,#050816)] shadow-[0_22px_60px_rgba(0,0,0,.38)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40"><div className="relative m-2 overflow-hidden rounded-[1.55rem] bg-slate-900"><div className="aspect-[1.08/1]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" /></div><div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" /><div className="absolute left-3 top-3 flex flex-wrap gap-1.5">{discount > 0 ? <span className="rounded-full bg-blue-500 px-2.5 py-1 font-black text-[10px] text-white uppercase tracking-wider">-{discount}%</span> : null}<span className="rounded-full border border-cyan-200/25 bg-gradient-to-r from-cyan-300/90 to-blue-500/90 px-2.5 py-1 font-black text-[10px] text-slate-950 uppercase tracking-wider"><Sparkles className="mr-1 inline size-3" />{product.category}</span></div><div className="absolute right-3 bottom-3 grid size-12 place-items-center rounded-2xl border border-cyan-200/20 bg-black/62 text-cyan-200 backdrop-blur-xl"><Icon className="size-6" /></div></div><div className="flex flex-1 flex-col px-4 pb-4 pt-2"><div className="mb-2 flex min-h-5 items-center justify-between gap-2"><span className="inline-flex items-center gap-1 font-black text-[10px] text-cyan-200"><Star className="size-3 fill-current" />{product.rating.toFixed(1)}</span><span className="inline-flex max-w-[56%] items-center gap-1 truncate rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-0.5 font-bold text-[9px] text-slate-300"><Truck className="size-3 shrink-0" />{product.delivery}</span></div><p className="font-black text-[9px] uppercase tracking-[0.24em] text-cyan-300">{product.category}</p><h3 className="mt-1 line-clamp-2 min-h-[2.6em] font-black text-[15px] text-white leading-snug">{product.name}</h3><p className="mt-2 line-clamp-2 min-h-[2.6em] text-[11px] text-slate-400 leading-5">{product.description}</p><div className="mt-3 grid gap-1.5">{product.features.map((item) => <span key={item} className="inline-flex items-center gap-1.5 text-[10px] text-slate-400"><PackageCheck className="size-3.5 text-cyan-300" />{item}</span>)}</div><div className="mt-auto pt-4"><div className="flex items-end justify-between gap-3"><div><span className="block font-black text-2xl text-cyan-100 tracking-tight">{formatPrice(product.price)}</span>{product.oldPrice ? <span className="text-xs text-slate-600 line-through">{formatPrice(product.oldPrice)}</span> : null}</div><span className="rounded-full bg-white/[0.08] px-2.5 py-1 font-black text-[10px] text-slate-400">{stockLabel}</span></div><a href={checkoutHref(product)} onClick={() => saveCheckoutProduct(product)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600 px-3 font-black text-[12px] text-slate-950 shadow-[0_18px_48px_rgba(0,82,255,.22)] transition hover:brightness-110"><ShoppingBag className="size-4" /> Ir a checkout</a></div></div></article>;
}

export function OmnifixPremiumStorefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = ["Todos", ...Array.from(new Set(products.map((product) => product.category)))];
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => (category === "Todos" || product.category === category) && (!q || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(q)));
  }, [category, query]);
  const heroProduct = filteredProducts[0] ?? products[0];

  return <main className="min-h-screen overflow-hidden bg-[#060914] pb-28 text-white md:pb-0"><section className="relative mx-auto max-w-[1440px] px-4 pb-6 pt-4 md:px-8 md:pb-10"><div className="relative overflow-hidden rounded-[2rem] bg-[#070b17] p-0 shadow-[0_26px_90px_rgba(0,0,0,.32)] md:rounded-[2.5rem]"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1800&auto=format&fit=crop" alt="Taller técnico Omnifix" className="absolute inset-0 h-full w-full object-cover opacity-62" /><div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,.94)_0%,rgba(2,6,23,.74)_48%,rgba(2,6,23,.32)_100%)]" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_10%,rgba(0,245,255,.20),transparent_24rem),radial-gradient(circle_at_84%_20%,rgba(0,82,255,.24),transparent_24rem)]" /><div className="relative z-10 grid min-h-[690px] gap-0 lg:grid-cols-[1.04fr_.96fr]"><div className="flex flex-col justify-between p-6 md:p-10"><div><div className="flex items-center justify-between gap-4"><OmnifixWordmark /><a href="/admin" className="hidden rounded-full border border-cyan-300/20 bg-white/[0.08] px-4 py-2 font-black text-xs text-cyan-100 backdrop-blur-xl md:inline-flex">Entrar admin</a></div><div className="mt-8 inline-flex items-center gap-2 rounded-full bg-cyan-300/10 px-3 py-1.5 font-black text-[10px] uppercase tracking-[.22em] text-cyan-100 ring-1 ring-cyan-300/20"><BadgeCheck className="size-3.5" /> Tienda técnica verificada</div><h1 className="mt-6 max-w-3xl font-black text-[clamp(42px,10vw,88px)] leading-[.9] tracking-[-.08em]">Vende servicios técnicos sin perder clientes.</h1><p className="mt-5 max-w-xl text-sm text-slate-300 leading-7 md:text-base">Catálogo claro, búsqueda rápida, checkout guiado con Mercado Pago y acceso directo al panel administrativo Omnifix.</p></div><div className="mt-8 max-w-xl"><label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar diagnóstico, notebook, celular..." className="h-14 w-full rounded-2xl bg-white px-12 font-bold text-sm text-slate-950 outline-none placeholder:text-slate-400 md:h-16" />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500"><X className="size-4" /></button> : null}</label><div className="mt-3 grid grid-cols-3 gap-2 text-center font-black text-[11px] text-white/80 uppercase tracking-[.12em]"><span className="rounded-2xl bg-white/[0.08] px-2 py-3 backdrop-blur-md"><b className="block text-lg text-cyan-200">{products.length}</b> servicios</span><span className="rounded-2xl bg-white/[0.08] px-2 py-3 backdrop-blur-md"><b className="block text-lg text-cyan-200">MP</b> checkout</span><span className="rounded-2xl bg-white/[0.08] px-2 py-3 backdrop-blur-md"><b className="block text-lg text-cyan-200">Admin</b> seguro</span></div></div></div><div className="hidden gap-4 p-4 pl-4 lg:grid"><article className="relative min-h-[360px] overflow-hidden rounded-[2rem] bg-slate-100 text-slate-950"><img src={heroProduct.image} alt={heroProduct.name} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.15),rgba(255,255,255,.88)_64%,rgba(255,255,255,.96))]" /><div className="relative z-10 flex min-h-[360px] flex-col justify-end p-6"><span className="w-fit rounded-full bg-slate-950 px-3 py-1.5 font-black text-[10px] text-white uppercase tracking-[.2em]">Recomendado</span><h2 className="mt-4 max-w-md font-black text-4xl leading-[.95] tracking-[-.07em]">{heroProduct.name}</h2><p className="mt-3 line-clamp-2 max-w-md text-sm text-slate-600 leading-6">{heroProduct.description}</p><div className="mt-5 flex flex-wrap items-center gap-3"><strong className="font-black text-3xl tracking-[-.04em]">{formatPrice(heroProduct.price)}</strong><a href={checkoutHref(heroProduct)} onClick={() => saveCheckoutProduct(heroProduct)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-5 font-black text-sm text-white"><ShoppingBag className="size-4" /> Checkout</a></div></div></article><article className="rounded-[2rem] bg-white/[0.06] p-5"><p className="font-black text-[10px] uppercase tracking-[.26em] text-cyan-300">Flujo público + admin</p><h3 className="mt-2 font-black text-3xl tracking-[-.05em]">El cliente paga, el equipo gestiona.</h3><div className="mt-5 grid gap-3">{benefits.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3"><Icon className="mt-0.5 size-5 shrink-0 text-cyan-300" /><div><b className="text-sm">{title}</b><p className="mt-1 text-xs text-slate-400 leading-5">{text}</p></div></div>)}</div></article></div></div></div></section><section id="catalogo" className="mx-auto max-w-[1440px] px-4 py-6 md:px-8"><div className="flex gap-2 overflow-x-auto border-y border-white/10 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 font-black text-xs transition ${category === item ? "bg-gradient-to-r from-cyan-300 to-blue-600 text-slate-950" : "border border-white/10 bg-white/[0.055] text-white/70"}`}>{item}</button>)}</div><div className="mb-6 mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="font-black text-[10px] uppercase tracking-[.3em] text-cyan-300">Catálogo usable</p><h2 className="mt-2 font-black text-3xl tracking-[-.055em] md:text-5xl">Servicios claros, checkout rápido.</h2><p className="mt-2 max-w-2xl text-sm text-slate-500 leading-6">{filteredProducts.length} resultado(s). Busca, filtra y envía al cliente directo al checkout de Omnifix.</p></div><a href="/admin/pagos/mercadopago" className="w-fit rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 font-black text-sm text-white">Mercado Pago <ArrowRight className="ml-1 inline size-4" /></a></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></section><section id="beneficios" className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-24 pt-8 md:grid-cols-3 md:px-8">{benefits.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6"><Icon className="mb-4 size-7 text-cyan-300" /><h3 className="font-black text-xl">{title}</h3><p className="mt-2 text-sm text-slate-500 leading-6">{text}</p></article>)}</section>{menuOpen ? <div className="fixed inset-x-3 bottom-[96px] z-50 rounded-[1.7rem] border border-white/10 bg-[#070b17]/96 p-3 text-white shadow-[0_24px_80px_rgba(0,0,0,.48)] backdrop-blur-2xl md:hidden"><div className="mb-3 flex items-center justify-between px-1"><p className="font-black text-[10px] uppercase tracking-[.26em] text-cyan-300">Menú rápido</p><button onClick={() => setMenuOpen(false)} className="rounded-full bg-white/10 px-3 py-1 font-black text-xs">Cerrar</button></div><div className="grid gap-2"><a href="/auth/v1/login" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><LogIn className="size-5 text-cyan-300" /> Iniciar sesión</a><a href="/admin/pagos/mercadopago" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><ShieldCheck className="size-5 text-cyan-300" /> Mercado Pago</a><a href="#catalogo" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><ShoppingBag className="size-5 text-cyan-300" /> Catálogo</a></div></div> : null}<div className="fixed inset-x-3 bottom-3 z-40 rounded-[1.4rem] border border-white/10 bg-[#0b1020]/92 p-2 shadow-[0_20px_70px_rgba(0,0,0,.28)] backdrop-blur-2xl md:hidden"><div className="flex items-center gap-2"><label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-cyan-200/75" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar servicio..." className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,245,255,.20),rgba(0,82,255,.18))] px-10 font-black text-sm text-white outline-none ring-1 ring-cyan-300/25 placeholder:text-white/55 focus:ring-cyan-300/60" /></label><button onClick={() => setMenuOpen((value) => !value)} className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-white ring-1 ring-white/10"><Menu className="size-5" /><span className="sr-only">Menú</span></button><a href={checkoutHref(heroProduct)} onClick={() => saveCheckoutProduct(heroProduct)} className="relative grid h-12 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-600 text-slate-950"><ShoppingBag className="size-5" /></a></div></div></main>;
}
