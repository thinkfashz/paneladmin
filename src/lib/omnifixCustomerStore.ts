import { listOmnifixOrders } from "@/lib/omnifixOrders";

export type CustomerLike = { id: string; productId: string; productName: string; createdAt: string };
export type CustomerComment = { id: string; productId: string; productName: string; text: string; createdAt: string };
export type SupportMessage = { id: string; role: "cliente" | "soporte"; text: string; createdAt: string };

export interface CustomerProfileRecord {
  email: string;
  name: string;
  likes: CustomerLike[];
  comments: CustomerComment[];
  support: SupportMessage[];
  updatedAt: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __OMNIFIX_CUSTOMERS__: Record<string, CustomerProfileRecord> | undefined;
}

function db() {
  if (!globalThis.__OMNIFIX_CUSTOMERS__) globalThis.__OMNIFIX_CUSTOMERS__ = {};
  return globalThis.__OMNIFIX_CUSTOMERS__;
}

function key(email: string) {
  return email.trim().toLowerCase() || "cliente@omnifix.local";
}

export function getCustomerProfile(email: string, name = "Cliente Omnifix") {
  const id = key(email);
  const store = db();
  if (!store[id]) {
    store[id] = {
      email: id,
      name,
      likes: [
        { id: "like-notebook", productId: "mantencion-notebook-pro", productName: "Mantención notebook pro", createdAt: new Date().toISOString() },
      ],
      comments: [
        { id: "comment-demo", productId: "diagnostico-express", productName: "Diagnóstico técnico express", text: "Quiero revisar disponibilidad para esta semana.", createdAt: new Date().toISOString() },
      ],
      support: [
        { id: "support-welcome", role: "soporte", text: "Hola, soy soporte Omnifix. Puedes consultar por tus pedidos o servicios aquí.", createdAt: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    };
  }
  return store[id];
}

export function getCustomerDashboard(email: string) {
  const profile = getCustomerProfile(email);
  const normalized = key(email);
  const orders = listOmnifixOrders(100).filter((order) => order.cliente?.email?.trim().toLowerCase() === normalized);
  return { profile, orders, realtime: { mode: "polling", intervalMs: 8000, source: "omnifix-customer-store" } };
}

export function addCustomerLike(email: string, product: { id: string; name: string }) {
  const profile = getCustomerProfile(email);
  if (!profile.likes.some((like) => like.productId === product.id)) {
    profile.likes.unshift({ id: `like-${Date.now()}`, productId: product.id, productName: product.name, createdAt: new Date().toISOString() });
    profile.updatedAt = new Date().toISOString();
  }
  return profile;
}

export function addCustomerComment(email: string, payload: { productId: string; productName: string; text: string }) {
  const profile = getCustomerProfile(email);
  profile.comments.unshift({ id: `comment-${Date.now()}`, productId: payload.productId, productName: payload.productName, text: payload.text, createdAt: new Date().toISOString() });
  profile.updatedAt = new Date().toISOString();
  return profile;
}

export function addSupportMessage(email: string, text: string) {
  const profile = getCustomerProfile(email);
  profile.support.push({ id: `support-${Date.now()}`, role: "cliente", text, createdAt: new Date().toISOString() });
  profile.support.push({ id: `support-auto-${Date.now()}`, role: "soporte", text: "Recibido. Un asesor Omnifix revisará tu caso y responderá por este canal.", createdAt: new Date().toISOString() });
  profile.updatedAt = new Date().toISOString();
  return profile;
}
