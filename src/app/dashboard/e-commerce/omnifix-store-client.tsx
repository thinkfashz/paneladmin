"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  CreditCard,
  Headphones,
  Heart,
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
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  TabletSmartphone,
  Trash2,
  Truck,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

import styles from "./omnifix-store.module.css";

type Category = "Todos" | "Celulares" | "Computadores" | "Audio" | "Smart Home" | "Servicio";
type CheckoutStatus = "idle" | "processing" | "approved" | "rejected";

type Product = {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  price: number;
  oldPrice?: number;
  badge: string;
  description: string;
  specs: string[];
  icon: "phone" | "laptop" | "audio" | "cpu" | "service" | "smart";
  image: string;
  accent: string;
  rating: number;
  stock: string;
};

const categories: Category[] = ["Todos", "Celulares", "Computadores", "Audio", "Smart Home", "Servicio"];

const imageUrl = (id: string, query = "electronics") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=88&ixlib=rb-4.0.3&${query}`;

const products: Product[] = [
  {
    id: "omni-iphone-battery",
    name: "Cambio batería iPhone",
    category: "Celulares",
    price: 34990,
    oldPrice: 44990,
    badge: "Más vendido",
    description: "Batería premium, calibración de salud y prueba de carga antes de entregar.",
    specs: ["Instalación express", "Garantía 90 días", "Diagnóstico incluido"],
    icon: "phone",
    image: imageUrl("photo-1511707171634-5f897ff02aa9", "phone"),
    accent: "#0057ff",
    rating: 4.9,
    stock: "Disponible hoy",
  },
  {
    id: "omni-screen",
    name: "Pantalla OLED compatible",
    category: "Celulares",
    price: 89990,
    badge: "Express",
    description: "Pantalla con prueba táctil, brillo y color antes de instalar en el equipo.",
    specs: ["OLED compatible", "Prueba táctil", "Instalación en tienda"],
    icon: "smart",
    image: imageUrl("photo-1598327105666-5b89351aff97", "smartphone"),
    accent: "#12b5ff",
    rating: 4.8,
    stock: "Stock limitado",
  },
  {
    id: "omni-laptop-maintenance",
    name: "Mantención notebook pro",
    category: "Computadores",
    price: 29990,
    oldPrice: 39990,
    badge: "24h",
    description: "Limpieza interna, pasta térmica, revisión de temperatura y optimización inicial.",
    specs: ["Limpieza interna", "Pasta térmica", "Reporte técnico"],
    icon: "laptop",
    image: imageUrl("photo-1496181133206-80ce9b88a853", "laptop"),
    accent: "#0f172a",
    rating: 4.9,
    stock: "Agenda abierta",
  },
  {
    id: "omni-ssd",
    name: "Upgrade SSD + instalación",
    category: "Computadores",
    price: 64990,
    badge: "Rápido",
    description: "SSD 480GB, migración básica y equipo listo para trabajar más rápido.",
    specs: ["SSD 480GB", "Migración básica", "Optimización inicial"],
    icon: "cpu",
    image: imageUrl("photo-1518770660439-4636190af475", "circuit"),
    accent: "#2563eb",
    rating: 4.7,
    stock: "Disponible",
  },
  {
    id: "omni-headset",
    name: "Audífonos Bluetooth Pro",
    category: "Audio",
    price: 49990,
    oldPrice: 59990,
    badge: "Nuevo",
    description: "Audio inalámbrico, batería extendida y carga rápida para trabajo o gaming.",
    specs: ["Bluetooth 5.3", "Carga rápida", "Bajos mejorados"],
    icon: "audio",
    image: imageUrl("photo-1505740420928-5e560c06d30e", "headphones"),
    accent: "#334155",
    rating: 4.6,
    stock: "Disponible",
  },
  {
    id: "omni-homekit",
    name: "Kit Smart Home inicial",
    category: "Smart Home",
    price: 79990,
    badge: "Pack",
    description: "Ampolletas, enchufe inteligente y configuración inicial para automatizar tu casa.",
    specs: ["3 dispositivos", "Configuración incluida", "Control móvil"],
    icon: "smart",
    image: imageUrl("photo-1558002038-1055907df827", "smart-home"),
    accent: "#0284c7",
    rating: 4.8,
    stock: "Pack disponible",
  },
  {
    id: "omni-diagnosis",
    name: "Diagnóstico técnico completo",
    category: "Servicio",
    price: 14990,
    badge: "Recuperable",
    description: "Revisión, informe y descuento si aceptas reparación del equipo.",
    specs: ["Informe técnico", "Presupuesto claro", "Abono recuperable"],
    icon: "service",
    image: imageUrl("photo-1581092160562-40aa08e78837", "technician"),
    accent: "#111827",
    rating: 5,
    stock: "Agenda disponible",
  },
  {
    id: "omni-data",
    name: "Respaldo y recuperación",
    category: "Servicio",
    price: 39990,
    badge: "Seguro",
    description: "Respaldo de archivos, fotos y preparación segura antes de formatear.",
    specs: ["Fotos y documentos", "Disco externo", "Privacidad"],
    icon: "cpu",
    image: imageUrl("photo-1558494949-ef010cbdcc31", "server"),
    accent: "#1d4ed8",
    rating: 4.9,
    stock: "Disponible",
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

function cardBrand(number: string) {
  const digits = number.replace(/\D/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "Discover";
  if (digits.length >= 4) return "Tarjeta";
  return "Detectando";
}

function formatCard(number: string) {
  return number.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
}

function productImageStyle(product: Product, compact = false): CSSProperties {
  return {
    position: "relative",
    minHeight: compact ? 76 : 172,
    borderRadius: compact ? 20 : 30,
    overflow: "hidden",
    background: `linear-gradient(135deg, ${product.accent}, #0b0d10)`,
    boxShadow: compact ? "0 12px 36px rgba(0,0,0,.2)" : "0 28px 80px rgba(0,0,0,.28)",
  };
}

function OmnifixLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={styles.logoWrap}>
      <svg width={compact ? 42 : 88} height={compact ? 42 : 88} viewBox="0 0 140 140" aria-label="Omnifix logo">
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
          <strong>OMNIFIX</strong>
          <span>TODO TIENE SOLUCIÓN</span>
        </div>
      )}
    </div>
  );
}

function ProductImage({ product, compact = false }: { product: Product; compact?: boolean }) {
  const Icon = iconMap[product.icon];

  return (
    <div style={productImageStyle(product, compact)}>
      <img src={product.image} alt={product.name} loading="lazy" className={styles.productPhoto} />
      <span className={compact ? styles.smallImageIcon : styles.imageIcon}><Icon /></span>
    </div>
  );
}

export default function OmnifixStoreClient() {
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkout, setCheckout] = useState(emptyCheckout);
  const [postalLoading, setPostalLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle");

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
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

  const subtotal = cartItems.reduce((total, item) => total + item.subtotal, 0);
  const shipping = subtotal > 120000 || subtotal === 0 ? 0 : 3990;
  const cartTotal = subtotal + shipping;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const detectedCard = cardBrand(checkout.cardNumber);

  function addToCart(productId: string) {
    setCart((current) => ({ ...current, [productId]: (current[productId] || 0) + 1 }));
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

  function toggleWishlist(productId: string) {
    setWishlist((current) => ({ ...current, [productId]: !current[productId] }));
  }

  function updateCheckout(field: keyof typeof emptyCheckout, value: string) {
    setCheckout((current) => ({ ...current, [field]: field === "cardNumber" ? formatCard(value) : value }));
  }

  async function fetchPostalCode() {
    const queryAddress = `${checkout.address}, ${checkout.city}, Chile`.trim();
    if (!checkout.address.trim()) return;

    setPostalLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(queryAddress)}`);
      const data = await response.json();
      const postcode = data?.[0]?.address?.postcode || "";
      setCheckout((current) => ({ ...current, postalCode: postcode || current.postalCode }));
    } catch {
      setCheckout((current) => ({ ...current, postalCode: current.postalCode || "No encontrado" }));
    } finally {
      setPostalLoading(false);
    }
  }

  function openCheckout() {
    if (!cartItems.length) addToCart(selectedProduct.id);
    setCartOpen(false);
    setCheckoutOpen(true);
    setCheckoutStatus("idle");
  }

  function processPayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutStatus("processing");
    window.setTimeout(() => {
      const digits = checkout.cardNumber.replace(/\D/g, "");
      const lastDigit = Number(digits.slice(-1));
      setCheckoutStatus(Number.isFinite(lastDigit) && lastDigit >= 3 ? "approved" : "rejected");
    }, 1300);
  }

  function sendWhatsapp() {
    const lines = cartItems.length
      ? cartItems.map((item) => `• ${item.name} x${item.quantity} — ${formatCurrency(item.subtotal)}`).join("\n")
      : `Quiero cotizar ${selectedProduct.name} en Omnifix.`;
    const message = encodeURIComponent(`Hola Omnifix, quiero cotizar:\n${lines}\n\nTotal referencial: ${formatCurrency(cartTotal)}`);
    window.open(`https://wa.me/56900000000?text=${message}`, "_blank");
  }

  if (loading) {
    return (
      <main className={styles.loaderScreen}>
        <div className={styles.loaderOrb} />
        <div className={styles.loaderCard}>
          <OmnifixLogo />
          <div className={styles.loaderBar}><span /></div>
          <p>Sincronizando vitrina, carrito y checkout...</p>
        </div>
      </main>
    );
  }

  const SelectedIcon = iconMap[selectedProduct.icon];

  return (
    <main className={styles.page}>
      <header className={styles.fixedSearchBar}>
        <div className={styles.brandMini}>
          <OmnifixLogo compact />
          <div><strong>Omnifix Store</strong><span>Vitrina inteligente</span></div>
        </div>
        <label className={styles.topSearch}>
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos, repuestos o servicios..." />
        </label>
        <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}>
          <ShoppingBag /><span>{cartCount}</span>
        </button>
      </header>

      <section className={styles.hero}>
        <div className={styles.navbar}>
          <div className={styles.brand}>
            <OmnifixLogo compact />
            <div><strong>Omnifix</strong><span>Todo tiene solución</span></div>
          </div>
          <nav className={styles.desktopNav}>
            <a href="#productos">Productos</a>
            <a href="#detalle">Detalle</a>
            <a href="#checkout">Checkout</a>
            <a href="#soporte">Soporte</a>
          </nav>
          <div className={styles.navActions}>
            <button className={styles.iconButton} type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
            <button className={styles.cartButton} type="button" onClick={() => setCartOpen(true)}><ShoppingBag /><span>{cartCount}</span></button>
          </div>
        </div>

        {menuOpen && (
          <div className={styles.mobileNav}>
            <a href="#productos" onClick={() => setMenuOpen(false)}>Productos</a>
            <a href="#detalle" onClick={() => setMenuOpen(false)}>Detalle</a>
            <a href="#checkout" onClick={() => setMenuOpen(false)}>Checkout</a>
          </div>
        )}

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <span className={styles.kicker}><Sparkles /> Vitrina premium Omnifix</span>
            <h1>Productos, servicios y checkout en una experiencia mobile first.</h1>
            <p>Selecciona un producto, agrégalo a deseos o carrito, abre su detalle y completa un checkout simulado con detección de tarjeta.</p>
            <div className={styles.heroButtons}>
              <a href="#productos" className={styles.primaryCta}>Explorar vitrina <ArrowRight /></a>
              <button type="button" className={styles.secondaryCta} onClick={openCheckout}><CreditCard /> Ir al checkout</button>
            </div>
            <div className={styles.trustRow}>
              <span><ShieldCheck /> Garantía técnica</span>
              <span><Truck /> Despacho o retiro</span>
              <span><Lock /> Pago simulado seguro</span>
            </div>
          </div>

          <div className={styles.appShowcase}>
            <div className={styles.storePhone}>
              <div className={styles.appTop}><Menu /><ShoppingBag /></div>
              <h2>Store</h2>
              <label className={styles.appSearch}><Search /><span>Search</span></label>
              <div className={styles.newArrival}><span>New Arrivals</span><ProductImage product={selectedProduct} compact /></div>
              <div className={styles.miniGrid}>{products.slice(0, 4).map((product) => <button key={product.id} onClick={() => selectProduct(product)}><ProductImage product={product} compact /><strong>{formatCurrency(product.price)}</strong></button>)}</div>
              <div className={styles.bottomPill}>••••</div>
            </div>
            <div className={styles.detailPhoneCard}>
              <div className={styles.detailNav}>‹ <span>Product</span> <ShoppingBag /></div>
              <h3>{selectedProduct.name}</h3>
              <strong>{formatCurrency(selectedProduct.price)}</strong>
              <ProductImage product={selectedProduct} />
              <button type="button" onClick={openCheckout}>Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      <section id="detalle" className={styles.productProjection}>
        <div className={styles.projectionCopy}>
          <span className={styles.kicker}>Producto proyectado</span>
          <h2>{selectedProduct.name}</h2>
          <p>{selectedProduct.description}</p>
          <div className={styles.specList}>{selectedProduct.specs.map((spec) => <span key={spec}><Check /> {spec}</span>)}</div>
          <div className={styles.heroButtons}>
            <button type="button" className={styles.primaryCta} onClick={() => addToCart(selectedProduct.id)}><ShoppingBag /> Agregar al carrito</button>
            <button type="button" className={styles.secondaryCta} onClick={() => toggleWishlist(selectedProduct.id)}><Heart /> {wishlist[selectedProduct.id] ? "En deseos" : "Lista de deseos"}</button>
          </div>
        </div>
        <div className={styles.projectionCard} style={{ background: `linear-gradient(160deg, ${selectedProduct.accent}, #171717)` }}>
          <div className={styles.detailNav}>‹ <span>Product</span> <ShoppingBag /></div>
          <ProductImage product={selectedProduct} />
          <div className={styles.projectionInfo}><span>{selectedProduct.stock}</span><h3>{selectedProduct.name}</h3><strong>{formatCurrency(selectedProduct.price)}</strong></div>
        </div>
      </section>

      <section id="productos" className={styles.productsSection}>
        <div className={styles.sectionHeader}>
          <div><span className={styles.kicker}>Catálogo visual</span><h2>Productos de prueba</h2></div>
          <div className={styles.searchBox}><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar..." /></div>
        </div>
        <div className={styles.categories}>{categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={selectedCategory === category ? styles.categoryActive : ""}>{category}</button>)}</div>
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <article key={product.id} className={styles.productCard}>
              <button type="button" className={styles.productMediaButton} onClick={() => selectProduct(product)}><ProductImage product={product} /></button>
              <button type="button" className={[styles.wishButton, wishlist[product.id] ? styles.wishActive : ""].join(" ")} onClick={() => toggleWishlist(product.id)}><Heart /></button>
              <div className={styles.productTop}><span className={styles.productBadge}>{product.badge}</span><span className={styles.rating}><Star /> {product.rating}</span></div>
              <div className={styles.productBody}><span>{product.category}</span><h3>{product.name}</h3><p>{product.description}</p></div>
              <div className={styles.productFooter}><div><strong>{formatCurrency(product.price)}</strong>{product.oldPrice && <small>{formatCurrency(product.oldPrice)}</small>}</div><button type="button" onClick={() => addToCart(product.id)}><Plus /> Agregar</button></div>
            </article>
          ))}
        </div>
      </section>

      <section id="soporte" className={styles.support}>
        <div><span className={styles.kicker}>Checkout listo</span><h2>Del producto al pago simulado en segundos.</h2><p>El formulario incluye datos de entrega, búsqueda libre de código postal, tarjeta visual y pantalla de aprobación o rechazo.</p></div>
        <button type="button" onClick={openCheckout}><CreditCard /> Abrir checkout</button>
      </section>

      <aside className={[styles.cartDrawer, cartOpen ? styles.cartOpen : ""].join(" ")}>
        <div className={styles.cartHeader}><div><span>Carrito Omnifix</span><strong>{cartCount} item{cartCount === 1 ? "" : "s"}</strong></div><button type="button" onClick={() => setCartOpen(false)}><X /></button></div>
        <div className={styles.cartItems}>{cartItems.length ? cartItems.map((item) => <article key={item.id} className={styles.cartItem}><ProductImage product={item} compact /><div><strong>{item.name}</strong><span>{formatCurrency(item.price)} c/u</span></div><div className={styles.quantity}><button type="button" onClick={() => changeQuantity(item.id, -1)}><Minus /></button><span>{item.quantity}</span><button type="button" onClick={() => changeQuantity(item.id, 1)}><Plus /></button><button type="button" onClick={() => removeFromCart(item.id)}><Trash2 /></button></div></article>) : <div className={styles.emptyCart}><ShoppingBag /><p>Agrega un producto para preparar una cotización.</p></div>}</div>
        <div className={styles.cartFooter}><div><span>Total</span><strong>{formatCurrency(cartTotal)}</strong></div><button type="button" onClick={openCheckout}>Checkout <ChevronRight /></button></div>
      </aside>

      <aside id="checkout" className={[styles.checkoutDrawer, checkoutOpen ? styles.checkoutOpen : ""].join(" ")}>
        <div className={styles.checkoutHeader}><div><span>Checkout seguro</span><strong>Completar compra</strong></div><button type="button" onClick={() => setCheckoutOpen(false)}><X /></button></div>
        {checkoutStatus === "approved" || checkoutStatus === "rejected" ? (
          <div className={styles.paymentResult}>
            {checkoutStatus === "approved" ? <CheckCircle2 /> : <XCircle />}
            <h2>{checkoutStatus === "approved" ? "Pago procesado" : "Pago rechazado"}</h2>
            <p>{checkoutStatus === "approved" ? "La orden quedó preparada para retiro, despacho o coordinación por WhatsApp." : "La tarjeta fue rechazada en esta simulación. Revisa los datos o prueba otra tarjeta."}</p>
            <button type="button" onClick={() => setCheckoutStatus("idle")}>{checkoutStatus === "approved" ? "Ver resumen" : "Intentar nuevamente"}</button>
          </div>
        ) : (
          <form className={styles.checkoutForm} onSubmit={processPayment}>
            <div className={styles.orderSummary}><span>Resumen</span><strong>{formatCurrency(cartTotal)}</strong><small>Subtotal {formatCurrency(subtotal)} · Envío {shipping ? formatCurrency(shipping) : "Gratis"}</small></div>
            <input required placeholder="Nombre completo" value={checkout.name} onChange={(event) => updateCheckout("name", event.target.value)} />
            <input required type="email" placeholder="Correo electrónico" value={checkout.email} onChange={(event) => updateCheckout("email", event.target.value)} />
            <input required placeholder="WhatsApp" value={checkout.phone} onChange={(event) => updateCheckout("phone", event.target.value)} />
            <div className={styles.addressRow}><input required placeholder="Dirección" value={checkout.address} onChange={(event) => updateCheckout("address", event.target.value)} /><button type="button" onClick={fetchPostalCode} disabled={postalLoading}>{postalLoading ? <Loader2 className={styles.spin} /> : <MapPin />} CP</button></div>
            <div className={styles.twoCols}><input required placeholder="Ciudad" value={checkout.city} onChange={(event) => updateCheckout("city", event.target.value)} /><input placeholder="Código postal" value={checkout.postalCode} onChange={(event) => updateCheckout("postalCode", event.target.value)} /></div>
            <div className={styles.cardPreview}><div><span>{detectedCard}</span><strong>{checkout.cardNumber || "•••• •••• •••• ••••"}</strong><small>{checkout.cardName || "NOMBRE DEL CLIENTE"}</small></div><CreditCard /></div>
            <input required placeholder="Nombre en la tarjeta" value={checkout.cardName} onChange={(event) => updateCheckout("cardName", event.target.value)} />
            <input required inputMode="numeric" placeholder="Número de tarjeta" value={checkout.cardNumber} onChange={(event) => updateCheckout("cardNumber", event.target.value)} />
            <div className={styles.twoCols}><input required placeholder="MM/AA" value={checkout.expiry} onChange={(event) => updateCheckout("expiry", event.target.value)} /><input required inputMode="numeric" placeholder="CVC" value={checkout.cvc} onChange={(event) => updateCheckout("cvc", event.target.value)} /></div>
            <button type="submit" disabled={checkoutStatus === "processing"}>{checkoutStatus === "processing" ? <><Loader2 className={styles.spin} /> Procesando...</> : <><Lock /> Confirmar pago</>}</button>
          </form>
        )}
      </aside>

      {(cartOpen || checkoutOpen) && <button className={styles.overlay} type="button" aria-label="Cerrar" onClick={() => { setCartOpen(false); setCheckoutOpen(false); }} />}
    </main>
  );
}
