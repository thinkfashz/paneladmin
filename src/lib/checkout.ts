export type PaymentMethod = "transfer" | "mercadopago";

export interface LineItem {
  productoId: string | number;
  cantidad: number;
  precioUnitario: number;
  nombre?: string;
}

export interface ClienteCheckout {
  nombre: string;
  email: string;
  telefono?: string;
}

export interface CheckoutPayload {
  items: LineItem[];
  region: string;
  cliente: ClienteCheckout;
  shippingAddress?: string;
  paymentMethod?: PaymentMethod;
  clientOrderKey?: string;
}

export interface CheckoutSummary {
  subtotal: number;
  iva: number;
  despacho: number;
  total: number;
  moneda: "CLP";
}

export interface CheckoutValidationError {
  field: string;
  message: string;
}

const IVA = 0.19;

const REGION_RATES: Record<string, number> = {
  RM: 6990,
  V: 8990,
  VI: 8990,
  VII: 7990,
  VIII: 10990,
  XVI: 9990,
  IX: 12990,
  X: 13990,
  I: 15990,
  II: 15990,
  XV: 17990,
  XI: 22990,
  XII: 24990,
};

export function normalizeRegion(region: string) {
  return String(region || "RM").trim().toUpperCase().replace("REGIÓN", "").replace("REGION", "").trim();
}

export function calculateCheckoutSummary(items: LineItem[], region: string): CheckoutSummary {
  const subtotal = Math.round(items.reduce((acc, item) => acc + Math.max(1, Number(item.cantidad || 1)) * Number(item.precioUnitario || 0), 0));
  const iva = Math.round(subtotal * IVA);
  const units = items.reduce((acc, item) => acc + Math.max(1, Number(item.cantidad || 1)), 0);
  const rate = REGION_RATES[normalizeRegion(region)] ?? REGION_RATES.RM;
  const despacho = subtotal <= 0 ? 0 : subtotal >= 180000 ? 0 : Math.max(rate, Math.max(0, units - 1) * 2500);

  return {
    subtotal,
    iva,
    despacho,
    total: subtotal + iva + despacho,
    moneda: "CLP",
  };
}

export function validateCheckoutPayload(payload: CheckoutPayload): CheckoutValidationError[] {
  const errors: CheckoutValidationError[] = [];

  if (!payload.items?.length) errors.push({ field: "items", message: "Debe incluir al menos un producto." });
  payload.items?.forEach((item, idx) => {
    if (!item.productoId) errors.push({ field: `items[${idx}].productoId`, message: "Producto inválido." });
    if (!Number.isFinite(Number(item.cantidad)) || Number(item.cantidad) <= 0) errors.push({ field: `items[${idx}].cantidad`, message: "La cantidad debe ser mayor a cero." });
    if (!Number.isFinite(Number(item.precioUnitario)) || Number(item.precioUnitario) <= 0) errors.push({ field: `items[${idx}].precioUnitario`, message: "Precio inválido." });
  });

  const nombre = payload.cliente?.nombre?.trim() ?? "";
  const email = payload.cliente?.email?.trim() ?? "";
  const telefono = payload.cliente?.telefono?.replace(/\D/g, "") ?? "";

  if (nombre.length < 3) errors.push({ field: "cliente.nombre", message: "Nombre demasiado corto." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: "cliente.email", message: "Email inválido." });
  if (telefono.length < 8) errors.push({ field: "cliente.telefono", message: "Teléfono inválido." });
  if (!payload.region?.trim()) errors.push({ field: "region", message: "Debes indicar región." });
  if ((payload.shippingAddress ?? "").trim().length < 6) errors.push({ field: "shippingAddress", message: "Dirección demasiado corta." });

  return errors;
}
