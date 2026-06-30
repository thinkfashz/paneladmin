import type { CheckoutPayload, CheckoutSummary, PaymentMethod } from "@/lib/checkout";

export type OmnifixOrderStatus = "pendiente_pago" | "pagada" | "fallida" | "pendiente_transferencia";

export interface OmnifixOrderRecord {
  id: string;
  cliente: CheckoutPayload["cliente"];
  items: CheckoutPayload["items"];
  resumen: CheckoutSummary;
  region: string;
  shippingAddress: string;
  estado: OmnifixOrderStatus;
  paymentMethod: PaymentMethod;
  paymentProvider?: "mercado_pago" | "transferencia";
  paymentId?: string | null;
  preferenceId?: string | null;
  checkoutUrl?: string | null;
  trackingUrl?: string;
  creadoEn: string;
  actualizadoEn: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __OMNIFIX_ORDERS__: OmnifixOrderRecord[] | undefined;
}

function store() {
  if (!globalThis.__OMNIFIX_ORDERS__) globalThis.__OMNIFIX_ORDERS__ = [];
  return globalThis.__OMNIFIX_ORDERS__;
}

export function upsertOmnifixOrder(order: OmnifixOrderRecord) {
  const orders = store();
  const idx = orders.findIndex((item) => item.id === order.id);
  if (idx >= 0) orders[idx] = { ...orders[idx], ...order, actualizadoEn: new Date().toISOString() };
  else orders.unshift(order);
  return order;
}

export function listOmnifixOrders(limit = 30) {
  return store().slice(0, limit);
}

export function findOmnifixOrder(id: string) {
  return store().find((order) => order.id === id) ?? null;
}

export function updateOmnifixOrderPayment(id: string, update: Partial<Pick<OmnifixOrderRecord, "estado" | "paymentId" | "preferenceId">>) {
  const orders = store();
  const found = orders.find((order) => order.id === id);
  if (!found) return null;
  Object.assign(found, update, { actualizadoEn: new Date().toISOString() });
  return found;
}
