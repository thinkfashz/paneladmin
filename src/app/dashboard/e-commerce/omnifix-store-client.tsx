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
  image: string;
  accent: string;
  rating: number;
};

const categories: Category[] = ["Todos", "Celulares", "Computadores", "Audio", "Smart Home", "Servicio"];

const imageUrl = (id: string, query = "electronics") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=88&ixlib=rb-4.0.3&${query}`;

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
    image: imageUrl("photo-1511707171634-5f897ff02aa9", "phone"),
    accent: "#0057ff",
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
    image: imageUrl("photo-1598327105666-5b89351aff97", "smartphone"),
    accent: "#12b5ff",
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
    image: imageUrl("photo-1496181133206-80ce9b88a853", "laptop"),
    accent: "#0f172a",
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
    image: imageUrl("photo-1518770660439-4636190af475", "circuit"),
    accent: "#2563eb",
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
    image: imageUrl("photo-1505740420928-5e560c06d30e", "headphones"),
    accent: "#334155",
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
    image: imageUrl("photo-1558002038-1055907df827", "smart-home"),
    accent: "#0284c7",
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
    image: imageUrl("photo-1581092160562-40aa08e78837", "technician"),
    accent: "#111827",
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
    image: imageUrl("photo-1558494949-ef010cbdcc31", "server"),
    accent: "#1d4ed8",
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

function ProductImage({ product, compact = false }: { product: Product; compact?: boolean }) {
  const Icon = iconMap[product.icon];

  return (
    <div
      className={styles.realProductImage}
      style={{
        minHeight: compact ? 74 : undefined,
        borderRadius: compact ? 18 : undefined,
        background: `linear-gradient(135deg, ${product.accent}, #020817)`,
      }}
    >
      <img src={product.image} alt={product.name} loading="lazy" />
      <span className={styles.imageIcon}><Icon /></span>
    </div>
  );
}

export default function OmnifixStoreClient() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1500);
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

  function selectProduct(product: Product) {
    setSelectedProduct(product);
    document.getElementById("detalle")?.scrollIntoView({ behavior: "smooth", block: "center" });
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
      : `Quiero cotizar ${selectedProduct.name} en Omnifix.`;

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
          <p>Preparando vitrina web Omnifix...</p>
        </div>
      </main>
    );
  }

  const SelectedIcon = iconMap[selectedProduct.icon];

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
            <a href="#detalle">Detalle</a>
            <a href="#tienda">Vitrina</a>
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
            <a href="#detalle" onClick={() => setMenuOpen(false)}>Detalle</a>
            <a href="#tienda" onClick={() => setMenuOpen(false)}>Vitrina</a>
            <a href="#soporte" onClick={() => setMenuOpen(false)}>Soporte</a>
          </div>
        )}

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>
              <Sparkles /> Vitrina web interactiva
            </span>
            <h1>Compra, cotiza y agenda servicios técnicos desde una tienda visual.</h1>
            <p>
              Una vitrina responsive con productos seleccionables, imágenes reales, carrito, detalle de producto y cotización por WhatsApp.
            </p>

            <div className={styles.heroButtons}>
              <a href="#productos" className={styles.primaryCta}>
                Ver productos <ArrowRight />
              </a>
              <button type="button" className={styles.secondaryCta} onClick={() => addToCart(selectedProduct.id)}>
                <ShoppingBag /> Agregar destacado
              </button>
            </div>

            <div className={styles.trustRow}>
              <span><ShieldCheck /> Garantía técnica</span>
              <span><PackageCheck /> Stock referencial</span>
              <span><BatteryCharging /> Diagnóstico rápido</span>
            </div>
          </div>

          <div className={styles.heroVisual} id="tienda">
            <div className={styles.referenceCard}>
              <ProductImage product={selectedProduct} />
            </div>

            <div className={styles.phoneMockup}>
              <div className={styles.phoneHeader}>
                <button type="button">‹</button>
                <span>Store</span>
                <Search />
              </div>

              <div className={styles.phoneBanner}>
                <div>
                  <span>{selectedProduct.category}</span>
                  <strong>{selectedProduct.name}</strong>
                </div>
                <SelectedIcon />
              </div>

              <div className={styles.phoneSearch}>
                <Search />
                <span>Buscar producto</span>
              </div>

              <div className={styles.phoneProducts}>
                {products.slice(0, 3).map((product) => (
                  <button key={product.id} type="button" className={styles.phoneProduct} onClick={() => selectProduct(product)}>
                    <ProductImage product={product} compact />
                    <strong>{product.name}</strong>
                    <span>{formatCurrency(product.price)}</span>
                  </button>
                ))}
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

      <section id="detalle" className={styles.darkFeature}>
        <div className={styles.darkCopy}>
          <span className={styles.kicker}>Producto seleccionado</span>
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.primaryCta} onClick={() => addToCart(selectedProduct.id)}>
              <ShoppingBag /> Agregar al carrito
            </button>
            <button type="button" className={styles.secondaryCta} onClick={sendWhatsapp}>
              <Phone /> Cotizar
            </button>
          </div>
        </div>
        <div className={styles.detailPhone} style={{ background: `linear-gradient(160deg, ${selectedProduct.accent}, #111827)` }}>
          <div className={styles.detailTop}>
            <button type="button">‹</button>
            <span>Product</span>
            <ShoppingBag />
          </div>
          <ProductImage product={selectedProduct} />
          <div className={styles.detailInfo}>
            <span>{selectedProduct.category}</span>
            <h3>{selectedProduct.name}</h3>
            <strong>{formatCurrency(selectedProduct.price)}</strong>
            <p>{selectedProduct.description}</p>
          </div>
        </div>
      </section>

      <section id="productos" className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.kicker}>Catálogo visual</span>
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
          {filteredProducts.map((product) => (
            <article key={product.id} className={styles.productCard}>
              <button type="button" className={styles.productSelect} onClick={() => selectProduct(product)} aria-label={`Seleccionar ${product.name}`}>
                <ProductImage product={product} />
              </button>
              <div className={styles.productTop}>
                <span className={styles.productBadge}>{product.badge}</span>
                <span className={styles.rating}><Star /> {product.rating}</span>
              </div>
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
          ))}
        </div>
      </section>

      <section id="servicios" className={styles.services}>
        {[
          ["Selección inmediata", "Toca cualquier producto y se actualiza el detalle principal de la vitrina."],
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
              <ProductImage product={item} compact />
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
