"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BatteryCharging,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Headphones,
  Laptop,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  TabletSmartphone,
  Trash2,
  Wrench,
  X,
} from "lucide-react";

import styles from "./omnifix-store.module.css";

type Category = "Todos" | "Celulares" | "Computadores" | "Audio" | "Smart Home" | "Servicio";

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  price: number;
  oldPrice?: number;
  badge: string;
  description: string;
  icon: "phone" | "laptop" | "audio" | "cpu" | "service" | "smart";
  rating: number;
};

const categories: Category[] = ["Todos", "Celulares", "Computadores", "Audio", "Smart Home", "Servicio"];

const products: Product[] = [
  {
    id: "omni-iphone-battery",
    name: "Cambio batería iPhone",
    category: "Celulares",
    price: 34990,
    oldPrice: 44990,
    badge: "Más vendido",
    description: "Diagnóstico, batería premium y calibración de salud.",
    icon: "phone",
    rating: 4.9,
  },
  {
    id: "omni-screen",
    name: "Pantalla OLED compatible",
    category: "Celulares",
    price: 89990,
    badge: "Express",
    description: "Pantalla lista para instalación con prueba táctil.",
    icon: "smart",
    rating: 4.8,
  },
  {
    id: "omni-laptop-maintenance",
    name: "Mantención notebook pro",
    category: "Computadores",
    price: 29990,
    oldPrice: 39990,
    badge: "24h",
    description: "Limpieza interna, pasta térmica y optimización.",
    icon: "laptop",
    rating: 4.9,
  },
  {
    id: "omni-ssd",
    name: "Upgrade SSD + instalación",
    category: "Computadores",
    price: 64990,
    badge: "Rápido",
    description: "SSD 480GB, migración básica y entrega lista para usar.",
    icon: "cpu",
    rating: 4.7,
  },
  {
    id: "omni-headset",
    name: "Audífonos Bluetooth Pro",
    category: "Audio",
    price: 49990,
    oldPrice: 59990,
    badge: "Nuevo",
    description: "Audio inalámbrico, batería extendida y carga rápida.",
    icon: "audio",
    rating: 4.6,
  },
  {
    id: "omni-homekit",
    name: "Kit Smart Home inicial",
    category: "Smart Home",
    price: 79990,
    badge: "Pack",
    description: "Ampolletas, enchufe inteligente y configuración inicial.",
    icon: "smart",
    rating: 4.8,
  },
  {
    id: "omni-diagnosis",
    name: "Diagnóstico técnico completo",
    category: "Servicio",
    price: 14990,
    badge: "Recuperable",
    description: "Revisión, informe y descuento si aceptas reparación.",
    icon: "service",
    rating: 5,
  },
  {
    id: "omni-data",
    name: "Respaldo y recuperación",
    category: "Servicio",
    price: 39990,
    badge: "Seguro",
    description: "Respaldo de archivos, fotos y preparación del equipo.",
    icon: "cpu",
    rating: 4.9,
  },
];

const iconMap = {
  phone: Smartphone,
  laptop: Laptop,
  audio: Headphones,
  cpu: Cpu,
  service: Wrench,
  smart: TabletSmartphone,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function OmnifixLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 8 : 14 }}>
      <svg width={compact ? 48 : 96} height={compact ? 48 : 96} viewBox="0 0 140 140" aria-label="Omnifix logo">
        <defs>
          <linearGradient id="omni-a" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#06152f" />
            <stop offset="0.56" stopColor="#0057ff" />
            <stop offset="1" stopColor="#44d7ff" />
          </linearGradient>
          <linearGradient id="omni-b" x1="1" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#0a1836" />
            <stop offset="1" stopColor="#000814" />
          </linearGradient>
        </defs>
        <path d="M74 8 128 116H95L64 51Z" fill="url(#omni-a)" />
        <path d="M16 116 54 42 73 79 54 116Z" fill="url(#omni-b)" />
        <path d="M51 116 70 82 91 116Z" fill="#0278ff" />
      </svg>
      {!compact && (
        <div>
          <strong style={{ display: "block", fontSize: 42, letterSpacing: "0.1em", lineHeight: 1, color: "#06152f" }}>OMNIFIX</strong>
          <span style={{ display: "block", marginTop: 8, fontSize: 11, letterSpacing: "0.45em", color: "#0057ff", fontWeight: 900 }}>TODO TIENE SOLUCIÓN</span>
        </div>
      )}
    </div>
  );
}

export default function OmnifixStoreClient() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
      const matchesQuery =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        product.description.toLowerCase().includes(normalized) ||
        product.category.toLowerCase().includes(normalized);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, quantity]) => {
        const product = products.find((item) => item.id === id);
        if (!product || quantity <= 0) return null;
        return { ...product, quantity, subtotal: product.price * quantity };
      })
      .filter(Boolean) as Array<Product & { quantity: number; subtotal: number }>;
  }, [cart]);

  const cartTotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  function addToCart(productId: string) {
    setCart((current) => ({
      ...current,
      [productId]: (current[productId] || 0) + 1,
    }));
    setCartOpen(true);
  }

  function removeFromCart(productId: string) {
    setCart((current) => {
      const next = { ...current };
      delete next[productId];
      return next;
    });
  }

  function changeQuantity(productId: string, delta: number) {
    setCart((current) => {
      const value = Math.max(0, (current[productId] || 0) + delta);
      if (!value) {
        const next = { ...current };
        delete next[productId];
        return next;
      }
      return { ...current, [productId]: value };
    });
  }

  function sendWhatsapp() {
    const lines = cartItems.length
      ? cartItems.map((item) => `• ${item.name} x${item.quantity} — ${formatCurrency(item.subtotal)}`).join("\n")
      : "Quiero cotizar productos y servicios Omnifix.";

    const message = encodeURIComponent(
      `Hola Omnifix, quiero cotizar:\n${lines}\n\nTotal referencial: ${formatCurrency(cartTotal)}`,
    );

    window.open(`https://wa.me/56900000000?text=${message}`, "_blank");
  }

  if (loading) {
    return (
      <main className={styles.loaderScreen}>
        <div className={styles.loaderGlow} />
        <div className={styles.loaderCard}>
          <OmnifixLogo />
          <div className={styles.loaderBar}>
            <span />
          </div>
          <p>Preparando tienda inteligente Omnifix...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.navbar}>
          <div className={styles.brand}>
            <OmnifixLogo compact />
            <div>
              <strong>Omnifix</strong>
              <span>Todo tiene solución</span>
            </div>
          </div>

          <nav className={styles.desktopNav}>
            <a href="#productos">Productos</a>
            <a href="#servicios">Servicios</a>
            <a href="#tienda">Tienda</a>
            <a href="#soporte">Soporte</a>
          </nav>

          <div className={styles.navActions}>
            <button className={styles.iconButton} type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú">
              {menuOpen ? <X /> : <Menu />}
            </button>
            <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}>
              <ShoppingBag />
              <span>{cartCount}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mobileNav}>
            <a href="#productos" onClick={() => setMenuOpen(false)}>Productos</a>
            <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
            <a href="#tienda" onClick={() => setMenuOpen(false)}>Tienda</a>
            <a href="#soporte" onClick={() => setMenuOpen(false)}>Soporte</a>
          </div>
        )}

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>
              <Sparkles /> Nueva experiencia de compra técnica
            </span>
            <h1>La tienda Omnifix para comprar, cotizar y reparar desde tu celular.</h1>
            <p>
              Un frontend premium para tu aplicación: productos de prueba, carrito funcional,
              búsqueda, categorías, animación inicial y contacto directo por WhatsApp.
            </p>

            <div className={styles.heroButtons}>
              <a href="#productos" className={styles.primaryCta}>
                Ver productos <ArrowRight />
              </a>
              <button type="button" className={styles.secondaryCta} onClick={sendWhatsapp}>
                <Phone /> Cotizar por WhatsApp
              </button>
            </div>

            <div className={styles.trustRow}>
              <span><ShieldCheck /> Garantía técnica</span>
              <span><PackageCheck /> Retiro y entrega</span>
              <span><BatteryCharging /> Diagnóstico rápido</span>
            </div>
          </div>

          <div className={styles.heroVisual} id="tienda">
            <div className={styles.referenceCard}>
              <div className={styles.phoneMockup} style={{ position: "relative", inset: "auto", width: "100%", minHeight: 520 }}>
                <div className={styles.phoneHeader}>
                  <button type="button">‹</button>
                  <span>Store</span>
                  <Search />
                </div>
                <div className={styles.phoneBanner}>
                  <div>
                    <span>Omnifix Care</span>
                    <strong>Repara, compra y agenda.</strong>
                  </div>
                  <Smartphone />
                </div>
              </div>
            </div>

            <div className={styles.phoneMockup}>
              <div className={styles.phoneHeader}>
                <button type="button">‹</button>
                <span>Store</span>
                <Search />
              </div>

              <div className={styles.phoneBanner}>
                <div>
                  <span>Omnifix Care</span>
                  <strong>Repara, compra y agenda.</strong>
                </div>
                <Smartphone />
              </div>

              <div className={styles.phoneSearch}>
                <Search />
                <span>Buscar producto</span>
              </div>

              <div className={styles.phoneProducts}>
                {products.slice(0, 3).map((product) => {
                  const Icon = iconMap[product.icon];
                  return (
                    <article key={product.id} className={styles.phoneProduct}>
                      <Icon />
                      <strong>{product.name}</strong>
                      <span>{formatCurrency(product.price)}</span>
                    </article>
                  );
                })}
              </div>

              <div className={styles.phoneBottom}>
                <span>⌂</span>
                <span>□</span>
                <span>♡</span>
                <span>☰</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.darkFeature}>
        <div className={styles.darkCopy}>
          <span className={styles.kicker}>Interfaz mobile first</span>
          <h2>Diseñada como una app moderna, pero lista dentro de tu dashboard.</h2>
          <p>Tarjetas flotantes, catálogo vertical, búsqueda y navegación inferior inspirada en tus referencias.</p>
        </div>
        <div className={styles.phoneMockup} style={{ position: "relative", inset: "auto", margin: "0 auto", background: "#161a22", color: "#fff" }}>
          <div className={styles.phoneHeader}>
            <button type="button">☰</button>
            <span>OmniStore</span>
            <ShoppingBag />
          </div>
          <div className={styles.phoneSearch} style={{ background: "#252b36", color: "#94a3b8" }}>
            <Search />
            <span>Search your fix</span>
          </div>
          <div className={styles.categories} style={{ margin: "16px 0" }}>
            <button className={styles.categoryActive}>All</button>
            <button>iPhone</button>
            <button>Audio</button>
          </div>
          {products.slice(0, 3).map((product) => {
            const Icon = iconMap[product.icon];
            return (
              <article key={product.id} className={styles.productCard} style={{ minHeight: 122, marginBottom: 12, background: "#222833", color: "#fff" }}>
                <div className={styles.productFooter}>
                  <div>
                    <strong>{product.name}</strong>
                    <small style={{ textDecoration: "none" }}>{product.category}</small>
                  </div>
                  <Icon style={{ width: 58, height: 58, color: "#38bdf8" }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="productos" className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.kicker}>Catálogo de prueba</span>
            <h2>Productos y servicios destacados</h2>
          </div>
          <div className={styles.searchBox}>
            <Search />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en Omnifix..." />
          </div>
        </div>

        <div className={styles.categories}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? styles.categoryActive : ""}
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.map((product) => {
            const Icon = iconMap[product.icon];
            return (
              <article key={product.id} className={styles.productCard}>
                <div className={styles.productTop}>
                  <span className={styles.productBadge}>{product.badge}</span>
                  <span className={styles.rating}><Star /> {product.rating}</span>
                </div>
                <div className={styles.productImage}><Icon /></div>
                <div className={styles.productBody}>
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>
                <div className={styles.productFooter}>
                  <div>
                    <strong>{formatCurrency(product.price)}</strong>
                    {product.oldPrice && <small>{formatCurrency(product.oldPrice)}</small>}
                  </div>
                  <button type="button" onClick={() => addToCart(product.id)}>
                    <Plus /> Agregar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="servicios" className={styles.services}>
        {[
          ["Diagnóstico inteligente", "El cliente revisa productos, servicios y precios referenciales antes de escribir."],
          ["Carrito funcional", "Agrega, suma, resta y prepara un mensaje de WhatsApp con el pedido."],
          ["Listo para conectar", "Después se puede conectar a InsForge, PocketBase, Stripe o Transbank."],
        ].map(([title, description]) => (
          <article key={title}>
            <CheckCircle2 />
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </section>

      <section id="soporte" className={styles.support}>
        <div>
          <span className={styles.kicker}>Omnifix soporte</span>
          <h2>Compra, agenda o cotiza desde un mismo frontend.</h2>
          <p>El próximo paso puede ser conectar este carrito con tu base de datos real y tu módulo de productos.</p>
        </div>
        <button type="button" onClick={sendWhatsapp}>
          <Phone /> Enviar carrito por WhatsApp
        </button>
      </section>

      <aside className={[styles.cartDrawer, cartOpen ? styles.cartOpen : ""].join(" ")}>
        <div className={styles.cartHeader}>
          <div>
            <span>Carrito Omnifix</span>
            <strong>{cartCount} item{cartCount === 1 ? "" : "s"}</strong>
          </div>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><X /></button>
        </div>
        <div className={styles.cartItems}>
          {cartItems.length ? cartItems.map((item) => (
            <article key={item.id} className={styles.cartItem}>
              <div><strong>{item.name}</strong><span>{formatCurrency(item.price)} c/u</span></div>
              <div className={styles.quantity}>
                <button type="button" onClick={() => changeQuantity(item.id, -1)}><Minus /></button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => changeQuantity(item.id, 1)}><Plus /></button>
                <button type="button" onClick={() => removeFromCart(item.id)}><Trash2 /></button>
              </div>
            </article>
          )) : (
            <div className={styles.emptyCart}><ShoppingBag /><p>Agrega un producto para preparar una cotización.</p></div>
          )}
        </div>
        <div className={styles.cartFooter}>
          <div><span>Total referencial</span><strong>{formatCurrency(cartTotal)}</strong></div>
          <button type="button" onClick={sendWhatsapp} disabled={!cartItems.length}>Enviar por WhatsApp <ChevronRight /></button>
        </div>
      </aside>

      {cartOpen && <button className={styles.overlay} type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} />}
    </main>
  );
}
