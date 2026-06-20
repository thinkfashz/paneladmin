"use client";

import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  Home,
  Laptop,
  Loader2,
  Lock,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
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

import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import styles from "../omnifix-store.module.css";

type ProductCategory = "Todos" | "Móviles" | "Consolas" | "Computadores" | "Smart Home" | "Servicios";
type ProductKind = Exclude<ProductCategory, "Todos">;
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
  icon: "phone" | "battery" | "console" | "laptop" | "smart" | "repair";
  image: string;
  accent: string;
  colors: ProductColor[];
  warranties: string[];
  description: string;
  specs: string[];
  trend: Array<{ month: string; demand: number }>;
};

type CartItem = {
  product: Product;
  quantity: number;
  color: ProductColor;
  warranty: string;
};

const imageUrl = (id: string, query: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=90&ixlib=rb-4.0.3&${query}`;

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
    description:
      "Kit de restauración premium para smartphone con panel OLED, adhesivo de estanqueidad y herramientas magnéticas de precisión.",
    specs: ["OLED compatible", "Prueba táctil", "Instalación express", "Garantía certificada"],
    trend: [
      { month: "Ene", demand: 18 },
      { month: "Feb", demand: 24 },
      { month: "Mar", demand: 31 },
      { month: "Abr", demand: 38 },
      { month: "May", demand: 44 },
      { month: "Jun", demand: 52 },
    ],
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
    description:
      "Optimización térmica extrema con limpieza interna, pasta térmica premium, revisión de ventilación y prueba de temperatura.",
    specs: ["Limpieza profunda", "Pasta térmica", "Prueba FPS", "Menor ruido"],
    trend: [
      { month: "Ene", demand: 12 },
      { month: "Feb", demand: 15 },
      { month: "Mar", demand: 23 },
      { month: "Abr", demand: 29 },
      { month: "May", demand: 36 },
      { month: "Jun", demand: 42 },
    ],
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
    description:
      "Celda de polímero de litio con microchip de protección contra sobrecarga, temperatura elevada y degradación prematura.",
    specs: ["Chip smart", "Carga segura", "Calibración", "Salud restaurada"],
    trend: [
      { month: "Ene", demand: 22 },
      { month: "Feb", demand: 31 },
      { month: "Mar", demand: 36 },
      { month: "Abr", demand: 41 },
      { month: "May", demand: 55 },
      { month: "Jun", demand: 61 },
    ],
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
    description:
      "Limpieza interna, pasta térmica, prueba de temperatura y optimización inicial para notebooks de trabajo o gaming.",
    specs: ["Limpieza interna", "Temperatura", "Reporte", "Optimización"],
    trend: [
      { month: "Ene", demand: 10 },
      { month: "Feb", demand: 12 },
      { month: "Mar", demand: 15 },
      { month: "Abr", demand: 22 },
      { month: "May", demand: 34 },
      { month: "Jun", demand: 39 },
    ],
  },
  {
    id: "smart-home-x1",
    name: "Kit Seguridad Smart Home X",
    brand: "OMNIFIX",
    category: "Smart Home",
    price: 320000,
    oldPrice: 380000,
    rating: 4.7,
    reviews: 412,
    stock: "Pack disponible",
    badge: "Domótica",
    icon: "smart",
    image: imageUrl("photo-1558002038-1055907df827", "smart-home"),
    accent: "#0f172a",
    colors: [
      { name: "Negro Absoluto", hex: "#090d16" },
      { name: "Aluminio", hex: "#e2e8f0" },
    ],
    warranties: ["12 meses", "24 meses PRO"],
    description:
      "Cerradura inteligente biométrica con control móvil, alerta remota y configuración inicial para hogares modernos.",
    specs: ["Biometría", "App móvil", "Instalación", "Cifrado"],
    trend: [
      { month: "Ene", demand: 6 },
      { month: "Feb", demand: 8 },
      { month: "Mar", demand: 12 },
      { month: "Abr", demand: 18 },
      { month: "May", demand: 25 },
      { month: "Jun", demand: 33 },
    ],
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
    accent: "#1d4ed8",
    colors: [
      { name: "Azul Scanner", hex: "#00d4ff" },
      { name: "Cromo Lab", hex: "#cbd5e1" },
    ],
    warranties: ["Informe", "Informe + retiro", "Informe PRO"],
    description:
      "Revisión técnica, informe visual y presupuesto claro. Si aceptas reparación, el diagnóstico puede descontarse del trabajo final.",
    specs: ["Informe", "Presupuesto", "Abono recuperable", "WhatsApp"],
    trend: [
      { month: "Ene", demand: 20 },
      { month: "Feb", demand: 25 },
      { month: "Mar", demand: 27 },
      { month: "Abr", demand: 32 },
      { month: "May", demand: 41 },
      { month: "Jun", demand: 48 },
    ],
  },
];

const CATEGORIES: ProductCategory[] = ["Todos", "Móviles", "Consolas", "Computadores", "Smart Home", "Servicios"];

const chartConfig = {
  demand: {
    label: "Demanda",
    color: "#00f5ff",
  },
} satisfies ChartConfig;

const iconMap = {
  phone: Smartphone,
  battery: BatteryCharging,
  console: Gamepad2,
  laptop: Laptop,
  smart: Home,
  repair: Wrench,
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

function OmnifixLogo({ compact = false }: { compact?: boolean }) {
  const size = compact ? 42 : 108;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 500 400" className={styles.logoMark} aria-label="Omnifix">
        <defs>
          <linearGradient id="omniLeftModule" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="55%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#020817" />
          </linearGradient>
          <linearGradient id="omniRightModule" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="45%" stopColor="#0052FF" />
            <stop offset="100%" stopColor="#05183A" />
          </linearGradient>
          <linearGradient id="omniBaseModule" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052FF" />
            <stop offset="52%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#0052FF" />
          </linearGradient>
        </defs>
        <ellipse cx="250" cy="340" rx="150" ry="15" fill="#0052FF" opacity="0.12" />
        <path d="M 235 60 L 140 250 L 250 250 L 215 200 L 175 200 L 235 85 Z" fill="url(#omniLeftModule)" />
        <path d="M 235 85 L 215 200 L 250 250 L 235 250 Z" fill="#050C1F" opacity="0.55" />
        <path d="M 255 50 C 265 90 310 180 380 270 L 325 285 C 275 210 245 130 235 70 Z" fill="url(#omniRightModule)" />
        <path d="M 252 58 C 260 95 295 170 350 250" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.45" />
        <path d="M 140 250 L 325 250 L 305 285 L 142 285 Z" fill="url(#omniBaseModule)" />
      </svg>
      {!compact && (
        <div className="leading-none">
          <strong className="block text-4xl font-black tracking-[.18em] text-white">OMNIFIX</strong>
          <span className="mt-2 block text-[10px] font-black uppercase tracking-[.42em] text-cyan-300">Todo tiene solución</span>
        </div>
      )}
    </div>
  );
}

function ProductVisual({ product, className = "" }: { product: Product; className?: string }) {
  const Icon = iconMap[product.icon];

  return (
    <div className={`relative overflow-hidden rounded-[2rem] ${className}`} style={{ background: `linear-gradient(135deg, ${product.accent}, #070b12)` }}>
      <img src={product.image} alt={product.name} className="h-full w-full object-cover opacity-90 mix-blend-screen saturate-125" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/10" />
      <div className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-2xl border border-white/20 bg-black/45 text-white backdrop-blur-xl">
        <Icon className="size-6" />
      </div>
    </div>
  );
}

function ProductDemandChart({ product }: { product: Product }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[.06] p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">Demanda</p>
          <h3 className="text-sm font-black text-white">Interés mensual</h3>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black text-cyan-200">shadcn/area</span>
      </div>
      <ChartContainer config={chartConfig} className="h-[160px] w-full">
        <AreaChart accessibilityLayer data={product.trend} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="demandFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-demand)" stopOpacity={0.72} />
              <stop offset="95%" stopColor="var(--color-demand)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="4 8" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
          <Area dataKey="demand" type="natural" fill="url(#demandFill)" fillOpacity={1} stroke="var(--color-demand)" strokeWidth={3} />
        </AreaChart>
      </ChartContainer>
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
    const timer = window.setTimeout(() => setLoading(false), 1150);
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

  const cartItems = Object.values(cart);
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= 180000 ? 0 : 3990;
  const total = subtotal + shipping;
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cardType = detectCard(checkout.cardNumber);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  }

  function selectProduct(product: Product) {
    setSelected(product);
    setSelectedColor(product.colors[0]);
    setSelectedWarranty(product.warranties[1] ?? product.warranties[0]);
    document.getElementById("detalle-omnifix")?.scrollIntoView({ behavior: "smooth", block: "center" });
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

  function processPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPaymentStatus("processing");
    window.setTimeout(() => {
      const digits = checkout.cardNumber.replace(/\D/g, "");
      const last = Number(digits.slice(-1));
      setPaymentStatus(Number.isFinite(last) && last >= 3 ? "approved" : "rejected");
    }, 1350);
  }

  if (loading) {
    return (
      <section className={styles.loadingScreen}>
        <div className={styles.loadingCard}>
          <div className="flex justify-center"><OmnifixLogo /></div>
          <div className={styles.loadingScan}><span /></div>
          <p className="mt-5 text-[11px] font-black uppercase tracking-[.2em] text-slate-200">Cargando vitrina interactiva</p>
          <p className="mt-2 text-xs text-slate-400">Sincronizando catálogo, carrito y checkout seguro.</p>
        </div>
      </section>
    );
  }

  return (
    <main className={styles.omnifixShell}>
      {toast && (
        <div className="fixed left-1/2 top-5 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/90 px-5 py-3 text-xs font-black text-white shadow-2xl backdrop-blur-xl">
          <Sparkles className="size-4 text-cyan-300" />
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070b12]/80 px-4 py-3 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <button className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white md:hidden" type="button">
            <Menu className="size-5" />
          </button>
          <div className="flex items-center gap-2 md:min-w-[210px]">
            <OmnifixLogo compact />
            <div className="hidden leading-none sm:block">
              <strong className="block text-sm font-black uppercase tracking-[.16em] text-white">Omnifix</strong>
              <span className="mt-1 block text-[9px] font-black uppercase tracking-[.28em] text-cyan-300">Store</span>
            </div>
          </div>
          <label className="flex min-h-12 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 text-slate-300 shadow-inner">
            <Search className="size-5 shrink-0" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar repuestos, servicios, consolas..." className="w-full bg-transparent text-sm font-bold text-white outline-none placeholder:text-slate-400" />
            {query && <button type="button" onClick={() => setQuery("")}><X className="size-4" /></button>}
          </label>
          <button type="button" onClick={() => setCartOpen(true)} className="relative grid size-12 place-items-center rounded-2xl bg-white text-slate-950 shadow-xl shadow-cyan-500/10">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-[#0052ff] text-[11px] font-black text-white">{count}</span>
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-14">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[.22em] text-cyan-100">
            <Zap className="size-4 text-cyan-300" /> Omnifix Ultra Plus
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-black leading-[.88] tracking-[-.08em] text-white md:text-7xl">Una vitrina técnica que se siente como una app premium.</h1>
            <p className="max-w-2xl text-base leading-8 text-slate-300 md:text-lg">Explora productos, servicios y kits. Selecciona variantes, añade a deseos, usa carrito, completa checkout y visualiza datos con gráfica shadcn/area.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#productos-omnifix" className={`${styles.chromeButton} inline-flex min-h-14 items-center gap-2 rounded-2xl px-6 text-sm font-black`}>Explorar vitrina <ChevronRight className="size-4" /></a>
            <button type="button" onClick={openCheckout} className={`${styles.darkButton} inline-flex min-h-14 items-center gap-2 rounded-2xl px-6 text-sm font-black`}>Checkout directo <CreditCard className="size-4" /></button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs font-bold text-slate-300">
            <span className="rounded-2xl border border-white/10 bg-white/5 p-3"><ShieldCheck className="mb-2 size-4 text-cyan-300" />Garantía real</span>
            <span className="rounded-2xl border border-white/10 bg-white/5 p-3"><Truck className="mb-2 size-4 text-cyan-300" />Retiro o envío</span>
            <span className="rounded-2xl border border-white/10 bg-white/5 p-3"><Lock className="mb-2 size-4 text-cyan-300" />Pago simulado</span>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-[.92fr_1.08fr] md:items-center">
          <div className={`${styles.mobileShell} p-6 text-slate-950`}>
            <div className="flex items-center justify-between"><Menu className="size-5" /><ShoppingBag className="size-5" /></div>
            <h2 className="mt-7 text-3xl font-black tracking-[-.06em]">Store</h2>
            <div className="mt-4 flex min-h-12 items-center gap-3 rounded-2xl bg-white px-4 shadow-xl shadow-slate-900/10"><Search className="size-5 text-slate-500" /><span className="text-sm font-bold text-slate-400">Search</span></div>
            <div className="mt-5 grid grid-cols-[1fr_120px] items-center gap-3 rounded-[1.7rem] bg-slate-100 p-4 shadow-xl shadow-slate-900/10">
              <div><p className="text-xs font-black uppercase text-slate-400">New arrivals</p><h3 className="mt-2 text-lg font-black leading-none">{selected.name}</h3></div>
              <ProductVisual product={selected} className="h-28" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {PRODUCTS.slice(0, 4).map((product) => (
                <button key={product.id} type="button" onClick={() => selectProduct(product)} className="rounded-[1.5rem] bg-white p-3 text-left shadow-lg shadow-slate-900/10">
                  <ProductVisual product={product} className="h-24" />
                  <strong className="mt-2 block text-xs">{money(product.price)}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.darkMobileShell} p-6 text-white`}>
            <div className="flex items-center justify-between"><ChevronLeft className="size-5" /><span className="text-sm font-black">Product</span><ShoppingBag className="size-5" /></div>
            <div className="mt-8 flex items-start justify-between gap-4">
              <div><p className="text-sm text-slate-300">{selected.category}</p><h3 className="mt-2 text-3xl font-black tracking-[-.06em]">{selected.name}</h3></div>
              <button type="button" onClick={() => toggleWishlist(selected.id)} className="grid size-12 place-items-center rounded-full bg-white text-slate-950"><Heart className={wishlist[selected.id] ? "size-5 fill-red-500 text-red-500" : "size-5"} /></button>
            </div>
            <strong className="mt-5 block text-4xl font-black">{money(selected.price)}</strong>
            <ProductVisual product={selected} className={`${styles.productGlow} mt-5 h-72`} />
            <button type="button" onClick={openCheckout} className="mt-6 min-h-14 w-full rounded-full bg-white text-sm font-black text-slate-950 shadow-xl">Buy Now</button>
          </div>
        </div>
      </section>

      <section id="detalle-omnifix" className={`${styles.glassPanel} mx-auto grid max-w-7xl gap-6 rounded-[2.6rem] p-5 md:grid-cols-[.9fr_1.1fr] md:p-8`}>
        <div className="space-y-5">
          <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[.22em] text-cyan-200">Producto proyectado</span>
          <h2 className="text-4xl font-black leading-none tracking-[-.07em] text-white md:text-6xl">{selected.name}</h2>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">{selected.description}</p>
          <div className="flex flex-wrap gap-2">
            {selected.specs.map((spec) => <span key={spec} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200"><Check className="size-3 text-cyan-300" />{spec}</span>)}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-slate-400">Color / acabado</p>
            <div className="flex flex-wrap gap-2">
              {selected.colors.map((color) => (
                <button key={color.name} type="button" onClick={() => setSelectedColor(color)} className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black ${selectedColor.name === color.name ? "border-cyan-300 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/5 text-slate-300"}`}>
                  <span className="size-4 rounded-full border border-white/30" style={{ backgroundColor: color.hex }} /> {color.name}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-slate-400">Cobertura</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {selected.warranties.map((warranty) => (
                <button key={warranty} type="button" onClick={() => setSelectedWarranty(warranty)} className={`rounded-2xl border px-4 py-3 text-xs font-black ${selectedWarranty === warranty ? "border-cyan-300 bg-[#0052ff] text-white" : "border-white/10 bg-white/5 text-slate-300"}`}>{warranty}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="button" onClick={() => addToCart(selected)} className={`${styles.chromeButton} inline-flex min-h-14 items-center gap-2 rounded-2xl px-6 text-sm font-black`}><ShoppingBag className="size-4" /> Añadir al carrito</button>
            <button type="button" onClick={() => toggleWishlist(selected.id)} className={`${styles.darkButton} inline-flex min-h-14 items-center gap-2 rounded-2xl px-6 text-sm font-black`}><Heart className="size-4" /> Lista de deseos</button>
          </div>
        </div>
        <div className="grid gap-4">
          <ProductVisual product={selected} className={`${styles.productGlow} min-h-[360px]`} />
          <ProductDemandChart product={selected} />
        </div>
      </section>

      <section id="productos-omnifix" className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><span className="text-[10px] font-black uppercase tracking-[.28em] text-cyan-200">Catálogo visual</span><h2 className="mt-2 text-4xl font-black tracking-[-.07em] text-white md:text-6xl">Productos de prueba</h2></div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full px-4 py-3 text-xs font-black ${category === item ? "bg-white text-slate-950" : "border border-white/10 bg-white/10 text-slate-200"}`}>{item}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article key={product.id} className={`${styles.productCard} rounded-[2.2rem] border border-white/10 bg-white/[.07] p-4 backdrop-blur-xl`}>
              <button type="button" onClick={() => selectProduct(product)} className="block w-full text-left"><ProductVisual product={product} className="h-64" /></button>
              <div className="mt-4 flex items-center justify-between gap-3"><span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black text-cyan-200">{product.badge}</span><span className="inline-flex items-center gap-1 text-xs font-black text-white"><Star className="size-4 fill-yellow-400 text-yellow-400" />{product.rating}</span></div>
              <div className="mt-4"><p className="text-[10px] font-black uppercase tracking-[.22em] text-slate-400">{product.category}</p><h3 className="mt-2 text-2xl font-black leading-none tracking-[-.04em] text-white">{product.name}</h3><p className="mt-3 min-h-14 text-sm leading-6 text-slate-300">{product.description}</p></div>
              <div className="mt-5 flex items-end justify-between gap-4"><div><strong className="block text-2xl font-black text-white">{money(product.price)}</strong>{product.oldPrice && <small className="text-sm font-bold text-slate-500 line-through">{money(product.oldPrice)}</small>}</div><div className="flex gap-2"><button type="button" onClick={() => toggleWishlist(product.id)} className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white"><Heart className={wishlist[product.id] ? "size-5 fill-red-500 text-red-500" : "size-5"} /></button><button type="button" onClick={() => addToCart(product)} className="grid size-12 place-items-center rounded-2xl bg-white text-slate-950"><Plus className="size-5" /></button></div></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mb-12 grid max-w-7xl gap-5 px-4 md:grid-cols-3">
        <div className={`${styles.glassPanel} rounded-[2rem] p-6`}><PackageCheck className="mb-4 size-8 text-cyan-300" /><h3 className="text-2xl font-black text-white">Carrito vivo</h3><p className="mt-3 text-sm leading-6 text-slate-300">Cantidad, colores, garantías y total se recalculan al instante.</p></div>
        <div className={`${styles.glassPanel} rounded-[2rem] p-6`}><MapPin className="mb-4 size-8 text-cyan-300" /><h3 className="text-2xl font-black text-white">Código postal</h3><p className="mt-3 text-sm leading-6 text-slate-300">Consulta gratuita con OpenStreetMap Nominatim desde la dirección del cliente.</p></div>
        <div className={`${styles.glassPanel} rounded-[2rem] p-6`}><CreditCard className="mb-4 size-8 text-cyan-300" /><h3 className="text-2xl font-black text-white">Tarjeta visual</h3><p className="mt-3 text-sm leading-6 text-slate-300">Detecta Visa, Mastercard, Amex o Discover y simula aprobación/rechazo.</p></div>
      </section>

      {cartOpen && <button className={styles.sheetOverlay} type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} />}
      {cartOpen && (
        <aside className={styles.sideSheet}>
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">Carrito</p><h2 className="text-3xl font-black text-white">{count} item{count === 1 ? "" : "s"}</h2></div><button type="button" onClick={() => setCartOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10 text-white"><X /></button></div>
          <div className="space-y-3 p-5">
            {cartItems.length ? cartItems.map((item) => {
              const key = `${item.product.id}-${item.color.name}-${item.warranty}`;
              return <article key={key} className="grid grid-cols-[92px_1fr] gap-4 rounded-[1.7rem] border border-white/10 bg-white/10 p-3"><ProductVisual product={item.product} className="h-24" /><div><h3 className="text-sm font-black text-white">{item.product.name}</h3><p className="mt-1 text-[11px] font-bold text-cyan-200">{item.color.name} · {item.warranty}</p><div className="mt-3 flex items-center justify-between"><strong className="text-white">{money(item.product.price * item.quantity)}</strong><div className="flex items-center gap-2"><button type="button" onClick={() => changeQuantity(key, -1)} className="grid size-8 place-items-center rounded-xl bg-black/30"><Minus className="size-4" /></button><span className="text-sm font-black text-white">{item.quantity}</span><button type="button" onClick={() => changeQuantity(key, 1)} className="grid size-8 place-items-center rounded-xl bg-black/30"><Plus className="size-4" /></button><button type="button" onClick={() => removeItem(key)} className="grid size-8 place-items-center rounded-xl bg-red-500/15 text-red-200"><Trash2 className="size-4" /></button></div></div></div></article>;
            }) : <div className="grid min-h-[300px] place-items-center text-center text-slate-300"><div><ShoppingBag className="mx-auto mb-4 size-12 text-cyan-300" /><p className="font-black">Tu carrito está vacío</p></div></div>}
          </div>
          <div className="sticky bottom-0 border-t border-white/10 bg-slate-950/90 p-5 backdrop-blur-xl"><div className="mb-4 space-y-2 text-sm text-slate-300"><div className="flex justify-between"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="flex justify-between"><span>Envío</span><strong>{shipping ? money(shipping) : "Gratis"}</strong></div><div className="flex justify-between border-t border-white/10 pt-3 text-xl text-white"><span>Total</span><strong>{money(total)}</strong></div></div><button type="button" onClick={openCheckout} className={`${styles.chromeButton} min-h-14 w-full rounded-2xl text-sm font-black`}>Ir al checkout</button></div>
        </aside>
      )}

      {checkoutOpen && <button className={styles.sheetOverlay} type="button" aria-label="Cerrar checkout" onClick={() => setCheckoutOpen(false)} />}
      {checkoutOpen && (
        <aside className={styles.sideSheet}>
          <div className="flex items-center justify-between border-b border-white/10 p-5"><div><p className="text-xs font-black uppercase tracking-[.22em] text-cyan-200">Checkout</p><h2 className="text-3xl font-black text-white">Compra segura</h2></div><button type="button" onClick={() => setCheckoutOpen(false)} className="grid size-11 place-items-center rounded-2xl bg-white/10 text-white"><X /></button></div>
          {paymentStatus === "approved" || paymentStatus === "rejected" ? (
            <div className="grid min-h-[70vh] place-items-center p-8 text-center text-white">
              <div>{paymentStatus === "approved" ? <CheckCircle2 className="mx-auto mb-5 size-20 text-emerald-400" /> : <XCircle className="mx-auto mb-5 size-20 text-red-400" />}<h3 className="text-4xl font-black tracking-[-.06em]">{paymentStatus === "approved" ? "Pago procesado" : "Pago rechazado"}</h3><p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-slate-300">{paymentStatus === "approved" ? "La orden quedó lista para despacho, retiro o coordinación técnica por WhatsApp." : "La simulación rechazó la tarjeta. Prueba con un número que termine en 3 o superior."}</p><button type="button" onClick={() => setPaymentStatus("idle")} className={`${styles.chromeButton} mt-7 min-h-14 rounded-2xl px-6 text-sm font-black`}>{paymentStatus === "approved" ? "Ver resumen" : "Intentar de nuevo"}</button></div>
            </div>
          ) : (
            <form onSubmit={processPayment} className="space-y-4 p-5">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-5"><p className="text-xs font-black uppercase tracking-[.22em] text-slate-400">Resumen</p><strong className="mt-2 block text-3xl font-black text-white">{money(total)}</strong><small className="mt-1 block text-slate-400">Subtotal {money(subtotal)} · Envío {shipping ? money(shipping) : "Gratis"}</small></div>
              <input required placeholder="Nombre completo" value={checkout.name} onChange={(e) => updateCheckout("name", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" />
              <input required type="email" placeholder="Correo electrónico" value={checkout.email} onChange={(e) => updateCheckout("email", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" />
              <input required placeholder="WhatsApp" value={checkout.phone} onChange={(e) => updateCheckout("phone", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" />
              <div className="grid grid-cols-[1fr_auto] gap-2"><input required placeholder="Dirección" value={checkout.address} onChange={(e) => updateCheckout("address", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" /><button type="button" onClick={fetchPostalCode} disabled={postalLoading} className="grid min-h-12 min-w-16 place-items-center rounded-2xl bg-white text-slate-950">{postalLoading ? <Loader2 className="size-4 animate-spin" /> : <MapPin className="size-4" />}</button></div>
              <div className="grid grid-cols-2 gap-2"><input required placeholder="Ciudad" value={checkout.city} onChange={(e) => updateCheckout("city", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" /><input placeholder="Código postal" value={checkout.postalCode} onChange={(e) => updateCheckout("postalCode", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" /></div>
              <div className="rounded-[1.8rem] border border-cyan-300/20 bg-gradient-to-br from-slate-100 via-slate-300 to-[#0052ff] p-5 text-slate-950 shadow-xl"><div className="flex items-start justify-between"><span className="text-xs font-black uppercase tracking-[.22em]">{cardType}</span><CreditCard className="size-8" /></div><strong className="mt-8 block text-xl tracking-wider">{checkout.cardNumber || "•••• •••• •••• ••••"}</strong><small className="mt-4 block font-black uppercase tracking-[.18em]">{checkout.cardName || "NOMBRE DEL CLIENTE"}</small></div>
              <input required placeholder="Nombre en la tarjeta" value={checkout.cardName} onChange={(e) => updateCheckout("cardName", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" />
              <input required inputMode="numeric" placeholder="Número de tarjeta" value={checkout.cardNumber} onChange={(e) => updateCheckout("cardNumber", e.target.value)} className="min-h-12 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" />
              <div className="grid grid-cols-2 gap-2"><input required placeholder="MM/AA" value={checkout.expiry} onChange={(e) => updateCheckout("expiry", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" /><input required inputMode="numeric" placeholder="CVC" value={checkout.cvc} onChange={(e) => updateCheckout("cvc", e.target.value)} className="min-h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-bold text-white outline-none placeholder:text-slate-500" /></div>
              <button type="submit" disabled={paymentStatus === "processing"} className={`${styles.chromeButton} inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl text-sm font-black`}>{paymentStatus === "processing" ? <><Loader2 className="size-4 animate-spin" /> Procesando...</> : <><Lock className="size-4" /> Confirmar pago</>}</button>
              <p className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400"><ShieldAlert className="size-4 text-cyan-300" /> Simulación: tarjetas que terminan en 0, 1 o 2 se rechazan; 3 o superior se aprueban.</p>
            </form>
          )}
        </aside>
      )}
    </main>
  );
}
