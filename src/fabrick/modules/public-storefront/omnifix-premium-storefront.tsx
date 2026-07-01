"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Headphones,
  Laptop,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  User,
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

type CartItem = { product: Product; quantity: number };

const CART_KEY = "omnifix-checkout-cart-v1";

const products: Product[] = [
  { id: "diagnostico-express", name: "Diagnóstico técnico express", category: "Servicio técnico", description: "Informe de falla, ruta de reparación y presupuesto antes de avanzar.", price: 14990, stock: 18, rating: 5, delivery: "Atención rápida", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop", icon: Wrench, features: ["Informe claro", "Cotización guiada"] },
  { id: "mantencion-notebook-pro", name: "Mantención notebook pro", category: "Computadores", description: "Limpieza interna, revisión térmica y optimización para equipos lentos.", price: 34990, oldPrice: 42990, stock: 9, rating: 4.9, delivery: "Entrega 24-48h", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop", icon: Laptop, features: ["Temperatura", "Optimización"] },
  { id: "reparacion-celular-premium", name: "Reparación celular premium", category: "Móviles", description: "Evaluación, cambio de piezas compatibles y entrega guiada para smartphones.", price: 44990, stock: 7, rating: 4.8, delivery: "Según repuesto", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop", icon: Smartphone, features: ["Pantallas", "Baterías"] },
  { id: "instalacion-configuracion", name: "Instalación y configuración", category: "Software", description: "Sistema, cuentas, seguridad básica, respaldo y aplicaciones clave.", price: 24990, stock: 12, rating: 5, delivery: "Remoto o local", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop", icon: Zap, features: ["Cuentas", "Seguridad"] },
  { id: "pack-seguridad-digital", name: "Pack seguridad digital", category: "Seguridad", description: "Protección básica, respaldo, revisión de accesos y recomendaciones.", price: 29990, stock: 6, rating: 4.9, delivery: "Mismo día", image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?q=80&w=1200&auto=format&fit=crop", icon: ShieldCheck, features: ["Backup", "Accesos"] },
  { id: "soporte-remoto-guiado", name: "Soporte remoto guiado", category: "Soporte", description: "Sesión de asistencia para resolver problemas o configurar herramientas.", price: 19990, stock: 20, rating: 4.8, delivery: "Online", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1200&auto=format&fit=crop", icon: Headphones, features: ["Videollamada", "Paso a paso"] },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(price);
}

function saveCart(cart: CartItem[]) {
  try {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart.map((item) => ({ product: { id: item.product.id, name: item.product.name, price: item.product.price, image_url: item.product.image, category_id: item.product.category }, quantity: item.quantity }))));
  } catch {}
}

function qty(cart: CartItem[]) {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

function total(cart: CartItem[]) {
  return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
}

function OmnifixWordmark() {
  return <div className="flex min-w-0 items-center gap-3"><div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-white/[0.08] p-1.5 shadow-[0_14px_44px_rgba(0,82,255,.28)] backdrop-blur-xl"><OmnifixLogo className="size-10" /></div><div className="min-w-0"><strong className="block truncate text-sm font-black uppercase tracking-[.28em] text-white">Omnifix</strong><span className="mt-1 block truncate text-[9px] font-black uppercase tracking-[.34em] text-cyan-200">Todo tiene solución</span></div></div>;
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product) => void }) {
  const Icon = product.icon;
  const discount = product.oldPrice ? Math.round(100 - (product.price / product.oldPrice) * 100) : 0;
  const stockLabel = product.stock <= 3 ? `Crítico · ${product.stock}` : product.stock <= 10 ? `Bajo · ${product.stock}` : `Disponible · ${product.stock}`;
  return <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_18%_0%,rgba(0,245,255,.12),transparent_16rem),linear-gradient(180deg,#101827,#050816)] shadow-[0_22px_60px_rgba(0,0,0,.34)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40">
    <div className="relative m-2 overflow-hidden rounded-[1.55rem] bg-slate-900"><div className="aspect-[1.08/1]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" loading="lazy" /></div><div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/12 to-transparent" /><div className="absolute left-3 top-3 flex flex-wrap gap-1.5">{discount > 0 ? <span className="rounded-full bg-blue-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white">-{discount}%</span> : null}<span className="rounded-full border border-cyan-200/25 bg-gradient-to-r from-cyan-300/90 to-blue-500/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950"><Sparkles className="mr-1 inline size-3" />{product.category}</span></div><div className="absolute bottom-3 right-3 grid size-12 place-items-center rounded-2xl border border-cyan-200/20 bg-black/62 text-cyan-200 backdrop-blur-xl"><Icon className="size-6" /></div></div>
    <div className="flex flex-1 flex-col px-4 pb-4 pt-2"><div className="mb-2 flex min-h-5 items-center justify-between gap-2"><span className="inline-flex items-center gap-1 text-[10px] font-black text-cyan-200"><Star className="size-3 fill-current" />{product.rating.toFixed(1)}</span><span className="inline-flex max-w-[56%] items-center gap-1 truncate rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-0.5 text-[9px] font-bold text-slate-300"><Truck className="size-3 shrink-0" />{product.delivery}</span></div><p className="text-[9px] font-black uppercase tracking-[0.24em] text-cyan-300">{product.category}</p><h3 className="mt-1 line-clamp-2 min-h-[2.6em] text-[15px] font-black leading-snug text-white">{product.name}</h3><p className="mt-2 line-clamp-2 min-h-[2.6em] text-[11px] leading-5 text-slate-400">{product.description}</p><div className="mt-3 grid gap-1.5">{product.features.map((item) => <span key={item} className="inline-flex items-center gap-1.5 text-[10px] text-slate-400"><PackageCheck className="size-3.5 text-cyan-300" />{item}</span>)}</div><div className="mt-auto pt-4"><div className="flex items-end justify-between gap-3"><div><span className="block text-2xl font-black tracking-tight text-cyan-100">{formatPrice(product.price)}</span>{product.oldPrice ? <span className="text-xs text-slate-600 line-through">{formatPrice(product.oldPrice)}</span> : null}</div><span className="rounded-full bg-white/[0.08] px-2.5 py-1 text-[10px] font-black text-slate-400">{stockLabel}</span></div><button onClick={() => onAdd(product)} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600 px-3 text-[12px] font-black text-slate-950 shadow-[0_18px_48px_rgba(0,82,255,.22)] transition hover:brightness-110"><ShoppingBag className="size-4" /> Agregar al carrito</button></div></div>
  </article>;
}

export function OmnifixPremiumStorefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(sessionStorage.getItem(CART_KEY) || "[]") as Array<{ product: { id: string; name: string; price: number; image_url?: string; category_id?: string }; quantity: number }>;
      if (Array.isArray(parsed)) setCart(parsed.map((item) => ({ product: products.find((product) => product.id === item.product.id) || { id: item.product.id, name: item.product.name, price: item.product.price, category: item.product.category_id || "Servicio", description: "Servicio Omnifix", stock: 1, rating: 5, delivery: "Coordinado", image: item.product.image_url || products[0].image, icon: Wrench, features: ["Servicio"] }, quantity: item.quantity })));
    } catch {}
  }, []);

  const categories = ["Todos", ...Array.from(new Set(products.map((product) => product.category)))];
  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => (category === "Todos" || product.category === category) && (!q || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(q)));
  }, [category, query]);
  const heroProduct = filteredProducts[0] ?? products[0];
  const cartCount = qty(cart);

  function addToCart(product: Product) {
    setCart((current) => {
      const found = current.find((item) => item.product.id === product.id);
      const next = found ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }];
      saveCart(next);
      setCartOpen(true);
      return next;
    });
  }

  function removeFromCart(productId: string) {
    setCart((current) => {
      const next = current.filter((item) => item.product.id !== productId);
      saveCart(next);
      return next;
    });
  }

  function goCheckout() {
    saveCart(cart);
    window.location.href = "/checkout";
  }

  return <main className="min-h-screen overflow-hidden bg-[#050816] pb-28 text-white md:pb-0"><style>{`@keyframes omniWave{0%{transform:translateX(-12%) translateY(0)}50%{transform:translateX(8%) translateY(-8px)}100%{transform:translateX(-12%) translateY(0)}}.omni-wave{animation:omniWave 9s ease-in-out infinite}.store-scroll::-webkit-scrollbar{display:none}`}</style>
    <section className="relative mx-auto max-w-[1440px] px-4 pb-6 pt-4 md:px-8 md:pb-10"><div className="relative min-h-[620px] overflow-hidden rounded-[2.2rem] border border-cyan-300/15 bg-[#07111f] shadow-[0_26px_90px_rgba(0,0,0,.32)] md:rounded-[2.6rem]"><div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,245,255,.22),transparent_24rem),radial-gradient(circle_at_82%_10%,rgba(0,82,255,.28),transparent_28rem),linear-gradient(180deg,#061429,#020617)]" /><div className="omni-wave absolute -left-32 top-16 h-56 w-[120%] rounded-full bg-cyan-300/10 blur-3xl" /><div className="omni-wave absolute -right-40 top-44 h-40 w-[110%] rounded-full bg-blue-500/15 blur-3xl [animation-delay:1.2s]" /><div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,transparent,rgba(0,82,255,.16),rgba(0,245,255,.06))]" />
      <div className="relative z-10 grid min-h-[620px] gap-6 p-6 md:p-10 lg:grid-cols-[1fr_460px] lg:items-center"><div><div className="flex items-center justify-between gap-4"><OmnifixWordmark /><div className="hidden items-center gap-2 md:flex"><a href="/mi-cuenta" className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black text-cyan-50">Mi cuenta</a><a href="/admin" className="rounded-full border border-cyan-300/20 bg-white/[0.08] px-4 py-2 text-xs font-black text-cyan-50">Admin</a></div></div><div className="mt-10 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.22em] text-cyan-100"><BadgeCheck className="size-3.5" /> HORIZON · Promoción técnica</div><h1 className="mt-6 max-w-3xl text-[clamp(44px,10vw,92px)] font-black leading-[.88] tracking-[-.085em]">Soluciones técnicas listas para comprar.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">Busca, filtra, agrega al carrito y finaliza desde Android, iPhone o PC.</p><div className="mt-7 max-w-xl"><label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar diagnóstico, notebook, celular..." className="h-14 w-full rounded-2xl bg-white px-12 text-sm font-bold text-slate-950 outline-none placeholder:text-slate-400 md:h-16" />{query ? <button type="button" onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-500"><X className="size-4" /></button> : null}</label></div></div><div className="relative hidden lg:block"><img src="/omnifix-logo-transparent.svg" alt="Omnifix todo tiene solución" className="mx-auto w-full max-w-[410px] object-contain drop-shadow-[0_26px_70px_rgba(0,82,255,.35)]" /><div className="mt-4 rounded-[2rem] border border-white/10 bg-white/[0.055] p-4 backdrop-blur-xl"><p className="text-[10px] font-black uppercase tracking-[.26em] text-cyan-300">Destacado</p><h2 className="mt-2 text-2xl font-black tracking-[-.04em]">{heroProduct.name}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{heroProduct.description}</p><button onClick={() => addToCart(heroProduct)} className="mt-4 inline-flex w-full justify-center rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950">Agregar destacado</button></div></div></div></div></section>
    <section id="catalogo" className="mx-auto max-w-[1440px] px-4 py-6 md:px-8"><div className="store-scroll flex gap-2 overflow-x-auto border-y border-white/10 py-3 [scrollbar-width:none]">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${category === item ? "bg-gradient-to-r from-cyan-300 to-blue-600 text-slate-950" : "border border-white/10 bg-white/[0.055] text-white/70"}`}>{item}</button>)}</div><div className="mb-6 mt-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-[10px] font-black uppercase tracking-[.3em] text-cyan-300">Catálogo</p><h2 className="mt-2 text-3xl font-black tracking-[-.055em] md:text-5xl">Compra rápida y clara.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{filteredProducts.length} resultado(s). Carrito persistente y checkout directo.</p></div><button onClick={() => setCartOpen(true)} className="w-fit rounded-full border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-black text-white">Ver carrito ({cartCount})</button></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAdd={addToCart} />)}</div></section>
    <section className="mx-auto grid max-w-[1440px] gap-4 px-4 pb-24 pt-8 md:grid-cols-3 md:px-8">{[{ icon: ShieldCheck, title: "Compra protegida", text: "Orden registrada y seguimiento." }, { icon: Truck, title: "Retiro o despacho", text: "Coordina atención según el caso." }, { icon: MessageCircle, title: "Soporte cliente", text: "Chat, historial y comentarios en Mi cuenta." }].map(({ icon: Icon, title, text }) => <article key={title} className="rounded-[1.8rem] border border-white/10 bg-white/[0.035] p-6"><Icon className="mb-4 size-7 text-cyan-300" /><h3 className="text-xl font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></article>)}</section>
    {cartOpen ? <div className="fixed inset-0 z-50 bg-black/70 p-3 backdrop-blur-xl"><aside className="ml-auto flex h-full w-full max-w-md flex-col rounded-[2rem] border border-cyan-300/15 bg-[#07111f] p-4 shadow-2xl"><div className="flex items-center justify-between"><h3 className="text-2xl font-black">Carrito</h3><button onClick={() => setCartOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10"><X className="size-5" /></button></div><div className="mt-5 grid flex-1 content-start gap-3 overflow-auto">{cart.length ? cart.map((item) => <div key={item.product.id} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"><img src={item.product.image} alt={item.product.name} className="size-16 rounded-xl object-cover" /><div className="min-w-0 flex-1"><b className="line-clamp-1 text-sm">{item.product.name}</b><p className="text-xs text-slate-500">{item.quantity} × {formatPrice(item.product.price)}</p></div><button onClick={() => removeFromCart(item.product.id)} className="text-xs font-black text-cyan-200">Quitar</button></div>) : <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">Tu carrito está vacío.</div>}</div><div className="border-t border-white/10 pt-4"><div className="flex items-center justify-between"><span className="text-sm text-slate-400">Total</span><b className="text-3xl text-cyan-100">{formatPrice(total(cart))}</b></div><button onClick={goCheckout} disabled={!cart.length} className="mt-4 inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950 disabled:opacity-40">Ir al checkout</button></div></aside></div> : null}
    {menuOpen ? <div className="fixed inset-x-3 bottom-[96px] z-40 rounded-[1.7rem] border border-white/10 bg-[#070b17]/96 p-3 text-white shadow-[0_24px_80px_rgba(0,0,0,.48)] backdrop-blur-2xl md:hidden"><div className="mb-3 flex items-center justify-between px-1"><p className="text-[10px] font-black uppercase tracking-[.26em] text-cyan-300">Menú rápido</p><button onClick={() => setMenuOpen(false)} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">Cerrar</button></div><div className="grid gap-2"><a href="/mi-cuenta" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><User className="size-5 text-cyan-300" /> Mi cuenta</a><a href="/auth/v1/login" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><User className="size-5 text-cyan-300" /> Iniciar sesión</a><a href="#catalogo" className="flex items-center gap-3 rounded-2xl bg-white/[0.07] p-3 font-black"><ShoppingBag className="size-5 text-cyan-300" /> Catálogo</a></div></div> : null}
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-[1.4rem] border border-white/10 bg-[#0b1020]/92 p-2 shadow-[0_20px_70px_rgba(0,0,0,.28)] backdrop-blur-2xl md:hidden"><div className="flex items-center gap-2"><label className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-cyan-200/75" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." className="h-12 w-full rounded-2xl bg-[linear-gradient(135deg,rgba(0,245,255,.20),rgba(0,82,255,.18))] px-10 text-sm font-black text-white outline-none ring-1 ring-cyan-300/25 placeholder:text-white/55" /></label><button onClick={() => setMenuOpen((value) => !value)} className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/[0.08] text-white ring-1 ring-white/10"><Menu className="size-5" /></button><button onClick={() => setCartOpen(true)} className="relative grid h-12 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-600 text-slate-950"><ShoppingBag className="size-5" />{cartCount ? <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-black text-slate-950">{cartCount}</span> : null}</button></div></div>
  </main>;
}
