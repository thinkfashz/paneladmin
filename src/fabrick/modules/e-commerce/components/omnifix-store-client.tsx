"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  BatteryCharging,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CreditCard,
  Gamepad2,
  Heart,
  Laptop,
  Loader2,
  Lock,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Wrench,
  X,
  XCircle,
  Zap,
} from "lucide-react";

type ProductCategory = "Todos" | "Móviles" | "Consolas" | "Computadores" | "Servicios";
type ProductKind = Exclude<ProductCategory, "Todos">;
type ProductIcon = "phone" | "battery" | "console" | "laptop" | "repair" | "cpu";
type PaymentStatus = "idle" | "processing" | "approved" | "rejected";

type ProductColor = {
  name: string;
  hex: string;
};

type Product = {
  id: string;
  name: string;
  brand: string;
  category: ProductKind;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: string;
  badge: string;
  icon: ProductIcon;
  image: string;
  accent: string;
  colors: ProductColor[];
  warranties: string[];
  description: string;
  specs: string[];
};

type CartItem = {
  product: Product;
  quantity: number;
  color: ProductColor;
  warranty: string;
};

const imageUrl = (id: string, query: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=760&q=76&ixlib=rb-4.0.3&${query}`;

const PRODUCTS: Product[] = [
  {
    id: "oled-ultra-pack",
    name: "Pack Pantalla OLED Ultra",
    brand: "OMNIFIX",
    category: "Móviles",
    price: 189990,
    oldPrice: 229990,
    rating: 4.9,
    reviews: 1240,
    stock: "Disponible hoy",
    badge: "Más vendido",
    icon: "phone",
    image: imageUrl("photo-1598327105666-5b89351aff97", "smartphone"),
    accent: "#0052ff",
    colors: [
      { name: "Cian Glacial", hex: "#00f5ff" },
      { name: "Azul Cobalto", hex: "#0052ff" },
      { name: "Negro Mate", hex: "#0f172a" },
    ],
    warranties: ["6 meses", "12 meses", "24 meses PRO"],
    description: "Pantalla OLED compatible, adhesivo de estanqueidad y prueba táctil antes de entregar.",
    specs: ["OLED compatible", "Prueba táctil", "Instalación express", "Garantía certificada"],
  },
  {
    id: "thermal-console-overhaul",
    name: "Overhaul Térmico Consola",
    brand: "OMNIFIX",
    category: "Consolas",
    price: 85000,
    oldPrice: 110000,
    rating: 4.8,
    reviews: 945,
    stock: "Agenda abierta",
    badge: "Gamer PRO",
    icon: "console",
    image: imageUrl("photo-1605901309584-818e25960a8f", "gaming-console"),
    accent: "#0ea5e9",
    colors: [
      { name: "Plata Líquida", hex: "#cbd5e1" },
      { name: "Cobre Puro", hex: "#ea580c" },
    ],
    warranties: ["6 meses", "12 meses", "24 meses PRO"],
    description: "Limpieza interna, pasta térmica premium, revisión de ventilación y prueba de temperatura.",
    specs: ["Limpieza profunda", "Pasta térmica", "Prueba FPS", "Menor ruido"],
  },
  {
    id: "smart-battery",
    name: "Batería Inteligente Omnifix",
    brand: "OMNIFIX",
    category: "Móviles",
    price: 65500,
    rating: 5,
    reviews: 1870,
    stock: "Stock inmediato",
    badge: "Autonomía",
    icon: "battery",
    image: imageUrl("photo-1616401784845-180882ba9ba8", "battery"),
    accent: "#2563eb",
    colors: [
      { name: "Azul Eléctrico", hex: "#0052ff" },
      { name: "Gris Grafito", hex: "#374151" },
    ],
    warranties: ["6 meses", "12 meses", "24 meses PRO"],
    description: "Celda de litio con protección contra sobrecarga, temperatura elevada y degradación prematura.",
    specs: ["Chip smart", "Carga segura", "Calibración", "Salud restaurada"],
  },
  {
    id: "laptop-pro-care",
    name: "Mantención Notebook Pro",
    brand: "OMNIFIX",
    category: "Computadores",
    price: 39990,
    rating: 4.9,
    reviews: 640,
    stock: "24 horas",
    badge: "Servicio",
    icon: "laptop",
    image: imageUrl("photo-1496181133206-80ce9b88a853", "laptop"),
    accent: "#334155",
    colors: [
      { name: "Grafito", hex: "#334155" },
      { name: "Cromo", hex: "#e2e8f0" },
    ],
    warranties: ["30 días", "90 días", "12 meses"],
    description: "Limpieza interna, pasta térmica, prueba de temperatura y optimización inicial.",
    specs: ["Limpieza interna", "Temperatura", "Reporte", "Optimización"],
  },
  {
    id: "ssd-upgrade",
    name: "Upgrade SSD + Instalación",
    brand: "OMNIFIX",
    category: "Computadores",
    price: 64990,
    oldPrice: 79990,
    rating: 4.7,
    reviews: 530,
    stock: "Disponible",
    badge: "Rápido",
    icon: "cpu",
    image: imageUrl("photo-1518770660439-4636190af475", "circuit"),
    accent: "#1d4ed8",
    colors: [
      { name: "Azul Técnico", hex: "#1d4ed8" },
      { name: "Grafito", hex: "#111827" },
    ],
    warranties: ["6 meses", "12 meses", "24 meses PRO"],
    description: "SSD de alto rendimiento, instalación limpia y migración básica para acelerar tu equipo.",
    specs: ["SSD incluido", "Migración básica", "Optimización", "Arranque rápido"],
  },
  {
    id: "diagnostico-total",
    name: "Diagnóstico Técnico Total",
    brand: "OMNIFIX",
    category: "Servicios",
    price: 14990,
    rating: 5,
    reviews: 590,
    stock: "Agenda disponible",
    badge: "Entrada",
    icon: "repair",
    image: imageUrl("photo-1581092160562-40aa08e78837", "technician"),
    accent: "#0891b2",
    colors: [
      { name: "Azul Scanner", hex: "#00d4ff" },
      { name: "Cromo Lab", hex: "#cbd5e1" },
    ],
    warranties: ["Informe", "Informe + retiro", "Informe PRO"],
    description: "Revisión técnica, informe visual y presupuesto claro. El diagnóstico puede descontarse si aceptas reparación.",
    specs: ["Informe", "Presupuesto", "Abono recuperable", "WhatsApp"],
  },
];

const CATEGORIES: ProductCategory[] = ["Todos", "Móviles", "Consolas", "Computadores", "Servicios"];

const iconMap = {
  phone: Smartphone,
  battery: BatteryCharging,
  console: Gamepad2,
  laptop: Laptop,
  repair: Wrench,
  cpu: Cpu,
};

const emptyCheckout = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "Santiago",
  postalCode: "",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

function money(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCard(value: string) {
  return value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

function detectCard(value: string) {
  const digits = value.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "Discover";
  if (digits.length >= 4) return "Tarjeta";
  return "Detectando";
}

function cls(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function OmnifixLogo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 36 : 76;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 500 400" aria-label="Omnifix" className="drop-shadow-[0_16px_28px_rgba(0,82,255,.28)]">
        <defs>
          <linearGradient id="omniTailwindLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="55%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#020817" />
          </linearGradient>
          <linearGradient id="omniTailwindRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="45%" stopColor="#0052FF" />
            <stop offset="100%" stopColor="#05183A" />
          </linearGradient>
          <linearGradient id="omniTailwindBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052FF" />
            <stop offset="52%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="340" rx="150" ry="15" fill="#0052FF" opacity="0.12" />
        <path d="M 235 60 L 140 250 L 250 250 L 215 200 L 175 200 L 235 85 Z" fill="url(#omniTailwindLeft)" />
        <path d="M 235 85 L 215 200 L 250 250 L 235 250 Z" fill="#050C1F" opacity="0.55" />
        <path d="M 255 50 C 265 90 310 180 380 270 L 325 285 C 275 210 245 130 235 70 Z" fill="url(#omniTailwindRight)" />
        <path d="M 252 58 C 260 95 295 170 350 250" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M 140 250 L 325 250 L 305 285 L 142 285 Z" fill="url(#omniTailwindBase)" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <strong className="block text-3xl font-black tracking-[.18em] text-white">OMNIFIX</strong>
          <span className="mt-2 block text-[10px] font-black uppercase tracking-[.38em] text-cyan-300">Todo tiene solución</span>
        </div>
      )}
    </div>
  );
}

function ProductVisual({ product, eager = false, className = "" }: { product: Product; eager?: boolean; className?: string }) {
  const Icon = iconMap[product.icon];

  return (
    <div className={cls("relative overflow-hidden rounded-[1.8rem] bg-slate-950", className)} style={{ background: `linear-gradient(135deg, ${product.accent}, #070b12)` }}>
      <img
        src={product.image}
        alt={product.name}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full object-cover opacity-90 mix-blend-screen saturate-125 transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-white/10" />
      <div className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-2xl border border-white/20 bg-black/45 text-white backdrop-blur-xl">
        <Icon className="size-5" />
      </div>
    </div>
  );
}

export default function OmnifixStoreClient() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Todos");
  const [selected, setSelected] = useState<Product>(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(PRODUCTS[0].colors[0]);
  const [selectedWarranty, setSelectedWarranty] = useState(PRODUCTS[0].warranties[1] ?? PRODUCTS[0].warranties[0]);
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkout, setCheckout] = useState(emptyCheckout);
  const [postalLoading, setPostalLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category;
      const matchesText = !text || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(text);
      return matchesCategory && matchesText;
    });
  }, [category, query]);

  const cartItems = Object.entries(cart);
  const subtotal = cartItems.reduce((total, [, item]) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 180000 ? 0 : 3990;
  const total = subtotal + shipping;
  const count = cartItems.reduce((sum, [, item]) => sum + item.quantity, 0);
  const cardType = detectCard(checkout.cardNumber);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function selectProduct(product: Product) {
    setSelected(product);
    setSelectedColor(product.colors[0]);
    setSelectedWarranty(product.warranties[1] ?? product.warranties[0]);
  }

  function addToCart(product = selected) {
    const color = product.id === selected.id ? selectedColor : product.colors[0];
    const warranty = product.id === selected.id ? selectedWarranty : product.warranties[1] ?? product.warranties[0];
    const key = `${product.id}-${color.name}-${warranty}`;

    setCart((current) => ({
      ...current,
      [key]: current[key]
        ? { ...current[key], quantity: current[key].quantity + 1 }
        : { product, quantity: 1, color, warranty },
    }));
    setCartOpen(true);
    notify(`${product.name} agregado al carrito`);
  }

  function changeQuantity(key: string, delta: number) {
    setCart((current) => {
      const item = current[key];
      if (!item) return current;
      const nextQty = item.quantity + delta;
      if (nextQty <= 0) {
        const next = { ...current };
        delete next[key];
        return next;
      }
      return { ...current, [key]: { ...item, quantity: nextQty } };
    });
  }

  function removeItem(key: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleWishlist(productId: string) {
    setWishlist((current) => ({ ...current, [productId]: !current[productId] }));
    notify(wishlist[productId] ? "Eliminado de favoritos" : "Guardado en favoritos");
  }

  function updateCheckout(field: keyof typeof emptyCheckout, value: string) {
    setCheckout((current) => ({ ...current, [field]: field === "cardNumber" ? formatCard(value) : value }));
  }

  async function fetchPostalCode() {
    if (!checkout.address.trim()) {
      notify("Escribe una dirección primero");
      return;
    }

    setPostalLoading(true);
    try {
      const lookup = `${checkout.address}, ${checkout.city}, Chile`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(lookup)}`);
      const data = await response.json();
      const postcode = data?.[0]?.address?.postcode || data?.[0]?.address?.city_district || "No encontrado";
      setCheckout((current) => ({ ...current, postalCode: postcode }));
      notify("Código postal consultado");
    } catch {
      setCheckout((current) => ({ ...current, postalCode: current.postalCode || "No encontrado" }));
      notify("No se pudo consultar el código postal");
    } finally {
      setPostalLoading(false);
    }
  }

  function openCheckout() {
    if (!cartItems.length) addToCart(selected);
    setCartOpen(false);
    setCheckoutOpen(true);
    setPaymentStatus("idle");
  }

  function processPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentStatus("processing");
    window.setTimeout(() => {
      const digits = checkout.cardNumber.replace(/\D/g, "");
      const last = Number(digits.slice(-1));
      setPaymentStatus(Number.isFinite(last) && last >= 3 ? "approved" : "rejected");
    }, 1050);
  }

  if (loading) {
    return (
      <section className="grid min-h-[100dvh] place-items-center overflow-hidden bg-[radial-gradient(circle_at_35%_15%,rgba(0,245,255,.18),transparent_28%),linear-gradient(135deg,#05070d,#111827_55%,#2b3038)] px-5 text-white">
        <div className="w-full max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-8 text-center shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="flex justify-center"><OmnifixLogo /></div>
          <div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10">
            <span className="block h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-white via-cyan-300 to-blue-600" />
          </div>
          <p className="mt-5 text-[11px] font-black uppercase tracking-[.24em] text-slate-200">Cargando vitrina TSX</p>
        </div>
      </section>
    );
  }

  return (
    <main className="relative min-h-[100dvh] overflow-x-hidden bg-[radial-gradient(circle_at_10%_8%,rgba(0,245,255,.14),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(0,82,255,.22),transparent_30%),linear-gradient(135deg,#07090f,#151b24_48%,#282e36)] text-white before:pointer-events-none before:fixed before:inset-0 before:bg-[linear-gradient(115deg,transparent,rgba(255,255,255,.06),transparent)] before:opacity-50">
      {toast && (
        <div className="fixed left-1/2 top-4 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/90 px-5 py-3 text-xs font-black text-white shadow-2xl backdrop-blur-xl">
          <Sparkles className="size-4 text-cyan-300" />
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b12]/85 px-3 py-3 backdrop-blur-2xl md:px-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden" type="button" aria-label="Menú">
            <Menu className="size-5" />
          </button>
          <div className="flex shrink-0 items-center gap-2 md:min-w-[190px]">
            <OmnifixLogo compact />
            <div className="hidden leading-none sm:block">
              <strong className="block text-sm font-black uppercase tracking-[.16em] text-white">Omnifix</strong>
              <span className="mt-1 block text-[9px] font-black uppercase tracking-[.28em] text-cyan-300">Store</span>
            </div>
          </div>
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 text-slate-300 shadow-inner">
            <Search className="size-5 shrink-0" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar producto o servicio..." className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-400" />
            {query && <button type="button" onClick={() => setQuery("")}><X className="size-4" /></button>}
          </label>
          <button type="button" onClick={() => setCartOpen(true)} className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-slate-950 shadow-xl shadow-cyan-500/10">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-[#0052ff] text-[11px] font-black text-white">{count}</span>
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-5 md:pt-8">
        <div className="rounded-[2.1rem] border border-white/10 bg-white/[.08] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl md:p-7">
          <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-cyan-100">
                <Zap className="size-4 text-cyan-300" /> Vitrina rápida TSX + Tailwind
              </span>
              <h1 className="mt-5 max-w-2xl text-4xl font-black leading-[.9] tracking-[-.07em] text-white md:text-6xl">Omnifix Store sin visor, directo al catálogo.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">Productos de prueba, selección rápida, carrito, favoritos y checkout completo en una interfaz limpia y liviana.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4"><ShieldCheck className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Garantía técnica</p><span className="text-xs text-slate-400">Cobertura por producto</span></div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4"><PackageCheck className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Stock visual</p><span className="text-xs text-slate-400">Productos listos</span></div>
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4"><Truck className="mb-3 size-6 text-cyan-300" /><p className="text-sm font-black">Retiro o envío</p><span className="text-xs text-slate-400">Flujo checkout</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[340px_1fr]">
        <aside className="h-max rounded-[2rem] border border-white/10 bg-white/[.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-200">Filtros</p>
              <h2 className="text-2xl font-black tracking-[-.05em]">Catálogo</h2>
            </div>
            <SlidersHorizontal className="size-5 text-cyan-200" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 lg:flex-col">
            {CATEGORIES.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={cls("rounded-2xl px-4 py-3 text-left text-xs font-black transition", category === item ? "bg-white text-slate-950" : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10")}>
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={openCheckout} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white via-slate-300 to-blue-600 text-sm font-black text-slate-950">
            <CreditCard className="size-4" /> Checkout directo
          </button>
        </aside>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product, index) => (
            <article key={product.id} className="group rounded-[2rem] border border-white/10 bg-white/[.07] p-4 shadow-2xl shadow-black/15 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-blue-500/10">
              <button type="button" onClick={() => selectProduct(product)} className="block w-full text-left">
                <ProductVisual product={product} eager={index < 3} className="h-56" />
              </button>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black text-cyan-200">{product.badge}</span>
                <span className="inline-flex items-center gap-1 text-xs font-black text-white"><Star className="size-4 fill-yellow-400 text-yellow-400" />{product.rating}</span>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-slate-400">{product.category}</p>
                <h3 className="mt-2 text-2xl font-black leading-none tracking-[-.04em] text-white">{product.name}</h3>
                <p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{product.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.specs.slice(0, 3).map((spec) => <span key={spec} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold text-slate-300">{spec}</span>)}
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div><strong className="block text-2xl font-black text-white">{money(product.price)}</strong>{product.oldPrice && <small className="text-sm font-bold text-slate-500 line-through">{money(product.oldPrice)}</small>}</div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => toggleWishlist(product.id)} className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white">
                    <Heart className={wishlist[product.id] ? "size-5 fill-red-500 text-red-500" : "size-5"} />
                  </button>
                  <button type="button" onClick={() => addToCart(product)} className="grid size-12 place-items-center rounded-2xl bg-white text-slate-950">
                    <Plus className="size-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-4">
        <div className="grid gap-5 rounded-[2rem] border border-white/10 bg-white/[.07] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[.24em] text-cyan-200">Producto seleccionado</span>
            <h2 className="mt-2 text-4xl font-black leading-none tracking-[-.06em] md:text-5xl">{selected.name}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">{selected.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {selected.colors.map((color) => (
                <button key={color.name} type="button" onClick={() => setSelectedColor(color)} className={cls("inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black", selectedColor.name === color.name ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300")}>
                  <span className="size-4 rounded-full border border-white/30" style={{ backgroundColor: color.hex }} /> {color.name}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {selected.warranties.map((warranty) => (
                <button key={warranty} type="button" onClick={() => setSelectedWarranty(warranty)} className={cls("rounded-2xl border px-4 py-3 text-xs font-black", selectedWarranty === warranty ? "border-cyan-300 bg-[#0052ff] text-white" : "border-white/10 bg-white/5 text-slate-300")}>{warranty}</button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => addToCart(selected)} className="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-gradient-to-br from-white via-slate-300 to-blue-600 px-5 text-sm font-black text-slate-950"><ShoppingBag className="size-4" /> Añadir</button>
              <button type="button" onClick={() => toggleWishlist(selected.id)} className="inline-flex min-h-13 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-black text-white"><Heart className="size-4" /> Deseos</button>
            </div>
          </div>
          <ProductVisual product={selected} eager className="min-h-[300px]" />
        </div>
      </section>

      {cartOpen && <button className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm" type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} />}
      {cartOpen && (
        <aside className="fixed inset-y-0 right-0 z-70 w-full max-w-[520px] overflow-y-auto border-l border-white/10 bg-slate-950/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">Carrito</p><h2 className="text-3xl font-black">{count} item{count === 1 ? "" : "s"}</h2></div><button type="button" onClick={() => setCartOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10"><X /></button></div>
          <div className="space-y-3 p-5">
            {cartItems.length ? cartItems.map(([key, item]) => (
              <article key={key} className="grid grid-cols-[92px_1fr] gap-4 rounded-[1.6rem] border border-white/10 bg-white/10 p-3"><ProductVisual product={item.product} className="h-24" /><div><h3 className="text-sm font-black">{item.product.name}</h3><p className="mt-1 text-[11px] font-bold text-cyan-200">{item.color.name} · {item.warranty}</p><div className="mt-3 flex items-center justify-between"><strong>{money(item.product.price * item.quantity)}</strong><div className="flex items-center gap-2"><button type="button" onClick={() => changeQuantity(key, -1)} className="grid size-8 place-items-center rounded-xl bg-black/30"><Minus className="size-4" /></button><span className="text-sm font-black">{item.quantity}</span><button type="button" onClick={() => changeQuantity(key, 1)} className="grid size-8 place-items-center rounded-xl bg-black/30"><Plus className="size-4" /></button><button type="button" onClick={() => removeItem(key)} className="grid size-8 place-items-center rounded-xl bg-red-500/15 text-red-200"><Trash2 className="size-4" /></button></div></div></div></article>
            )) : <div className="grid min-h-[260px] place-items-center text-center text-slate-300"><div><ShoppingBag className="mx-auto mb-4 size-12 text-cyan-300" /><p className="font-black">Tu carrito está vacío</p></div></div>}
          </div>
          <div className="sticky bottom-0 border-t border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl"><div className="mb-4 space-y-2 text-sm text-slate-300"><div className="flex justify-between"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{shipping ? money(shipping) : "Gratis"}</strong></div><div className="flex justify-between border-t border-white/10 pt-3 text-xl text-white"><span>Total</span><strong>{money(total)}</strong></div></div><button type="button" onClick={openCheckout} className="min-h-14 w-full rounded-2xl bg-gradient-to-br from-white via-slate-300 to-blue-600 text-sm font-black text-slate-950">Ir al checkout</button></div>
        </aside>
      )}

      {checkoutOpen && <button className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm" type="button" aria-label="Cerrar checkout" onClick={() => setCheckoutOpen(false)} />}
      {checkoutOpen && (
        <aside className="fixed inset-y-0 right-0 z-70 w-full max-w-[540px] overflow-y-auto border-l border-white/10 bg-slate-950/95 text-white shadow-2xl shadow-black/60 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">Checkout</p><h2 className="text-3xl font-black">Compra segura</h2></div><button type="button" onClick={() => setCheckoutOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10"><X /></button></div>
          {paymentStatus === "approved" || paymentStatus === "rejected" ? (
            <div className="grid min-h-[70vh] place-items-center p-8 text-center">
              <div>{paymentStatus === "approved" ? <CheckCircle2 className="mx-auto mb-5 size-20 text-emerald-400" /> : <XCircle className="mx-auto mb-5 size-20 text-red-400" />}<h3 className="text-4xl font-black tracking-[-.06em]">{paymentStatus === "approved" ? "Pago procesado" : "Pago rechazado"}</h3><p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-300">{paymentStatus === "approved" ? "La orden quedó lista para despacho, retiro o coordinación técnica por WhatsApp." : "La simulación rechazó la tarjeta. Prueba con un número que termine en 3 o superior."}</p><button type="button" onClick={() => setPaymentStatus("idle")} className="mt-7 min-h-14 rounded-2xl bg-white px-6 text-sm font-black text-slate-950">{paymentStatus === "approved" ? "Ver resumen" : "Intentar de nuevo"}</button></div>
            </div>
          ) : (
            <form onSubmit={processPayment} className="space-y-4 p-5">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-5"><p className="text-xs font-black uppercase tracking-[.22em] text-slate-400">Resumen</p><strong className="mt-2 block text-3xl font-black">{money(total)}</strong><small className="mt-1 block text-slate-400">Subtotal {money(subtotal)} · Envío {shipping ? money(shipping) : "Gratis"}</small></div>
              <input required placeholder="Nombre completo" value={checkout.name} onChange={(e) => updateCheckout("name", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" />
              <input required type="email" placeholder="Correo electrónico" value={checkout.email} onChange={(e) => updateCheckout("email", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" />
              <input required placeholder="WhatsApp" value={checkout.phone} onChange={(e) => updateCheckout("phone", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" />
              <div className="grid grid-cols-[1fr_auto] gap-2"><input required placeholder="Dirección" value={checkout.address} onChange={(e) => updateCheckout("address", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" /><button type="button" onClick={fetchPostalCode} disabled={postalLoading} className="grid min-h-12 min-w-16 place-items-center rounded-2xl bg-white text-slate-950">{postalLoading ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}</button></div>
              <div className="grid grid-cols-2 gap-2"><input required placeholder="Ciudad" value={checkout.city} onChange={(e) => updateCheckout("city", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" /><input placeholder="Código postal" value={checkout.postalCode} onChange={(e) => updateCheckout("postalCode", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" /></div>
              <div className="rounded-[1.8rem] border border-cyan-300/20 bg-gradient-to-br from-slate-100 via-slate-300 to-[#0052ff] p-5 text-slate-950 shadow-xl"><div className="flex items-start justify-between"><span className="text-xs font-black uppercase tracking-[.22em]">{cardType}</span><CreditCard className="size-8" /></div><strong className="mt-8 block text-xl tracking-wider">{checkout.cardNumber || "•••• •••• •••• ••••"}</strong><small className="mt-4 block font-black uppercase tracking-[.18em]">{checkout.cardName || "NOMBRE DEL CLIENTE"}</small></div>
              <input required placeholder="Nombre en la tarjeta" value={checkout.cardName} onChange={(e) => updateCheckout("cardName", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" />
              <input required inputMode="numeric" placeholder="Número de tarjeta" value={checkout.cardNumber} onChange={(e) => updateCheckout("cardNumber", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" />
              <div className="grid grid-cols-2 gap-2"><input required placeholder="MM/AA" value={checkout.expiry} onChange={(e) => updateCheckout("expiry", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" /><input required inputMode="numeric" placeholder="CVC" value={checkout.cvc} onChange={(e) => updateCheckout("cvc", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold outline-none placeholder:text-slate-500" /></div>
              <button type="submit" disabled={paymentStatus === "processing"} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white via-slate-300 to-blue-600 text-sm font-black text-slate-950">{paymentStatus === "processing" ? <><Loader2 className="size-4 animate-spin" /> Procesando...</> : <><Lock className="size-4" /> Confirmar pago</>}</button>
              <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400"><ChevronLeft className="size-4 text-cyan-300" /> Simulación: tarjetas que terminan en 0, 1 o 2 se rechazan; 3 o superior se aprueban.</p>
            </form>
          )}
        </aside>
      )}
    </main>
  );
}
