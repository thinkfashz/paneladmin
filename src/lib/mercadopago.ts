import type { CheckoutPayload, CheckoutSummary, LineItem } from "@/lib/checkout";

const API_BASE = "https://api.mercadopago.com";
const DEFAULT_SITE_URL = "https://omnifix.cl";

export type MercadoPagoConnectionStatus = "ok" | "unconfigured" | "unreachable" | "invalid_token";
export type MercadoPagoMode = "production" | "sandbox" | "unknown";

export interface MercadoPagoStatusResult {
  status: MercadoPagoConnectionStatus;
  publicKey: string;
  hasAccessToken: boolean;
  reachable: boolean;
  latencyMs: number | null;
  message: string;
  mode: MercadoPagoMode;
  tokenPrefix: string;
}

export interface MercadoPagoPreferenceResult {
  id: string;
  init_point?: string;
  sandbox_init_point?: string;
}

export interface MercadoPagoAccountInfo {
  id: string | number | null;
  email: string | null;
  nickname: string | null;
  siteId: string | null;
  isTestUser: boolean;
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getAppBaseUrl() {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  return trimTrailingSlash(fromEnv || DEFAULT_SITE_URL);
}

export function getMercadoPagoAccessToken() {
  return (process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || "").trim();
}

export function getMercadoPagoPublicKey() {
  return (
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY ||
    process.env.MP_PUBLIC_KEY ||
    process.env.MERCADO_PAGO_PUBLIC_KEY ||
    process.env.MERCADOPAGO_PUBLIC_KEY ||
    ""
  ).trim();
}

export function detectMpMode(accessToken: string): MercadoPagoMode {
  const token = accessToken.trim();
  if (!token) return "unknown";
  if (token.startsWith("APP_USR-")) return "production";
  if (token.startsWith("TEST-")) return "sandbox";
  return "unknown";
}

export function getMpTokenPrefix(accessToken: string): string {
  const token = accessToken.trim();
  if (!token) return "";
  const dash = token.indexOf("-");
  return dash > 0 ? token.slice(0, dash) : token.slice(0, Math.min(8, token.length));
}

export async function fetchMercadoPagoAccount(accessToken = getMercadoPagoAccessToken()): Promise<MercadoPagoAccountInfo | null> {
  const token = accessToken.trim();
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = (await response.json().catch(() => null)) as { id?: number | string; email?: string; nickname?: string; site_id?: string; tags?: string[] } | null;
    if (!data) return null;
    return {
      id: data.id ?? null,
      email: typeof data.email === "string" ? data.email : null,
      nickname: typeof data.nickname === "string" ? data.nickname : null,
      siteId: typeof data.site_id === "string" ? data.site_id : null,
      isTestUser: Array.isArray(data.tags) ? data.tags.includes("test_user") : false,
    };
  } catch {
    return null;
  }
}

export async function probeMercadoPago(): Promise<MercadoPagoStatusResult> {
  const publicKey = getMercadoPagoPublicKey();
  const accessToken = getMercadoPagoAccessToken();
  const mode = detectMpMode(accessToken);
  const tokenPrefix = getMpTokenPrefix(accessToken);

  if (!publicKey && !accessToken) {
    return { status: "unconfigured", publicKey: "", hasAccessToken: false, reachable: false, latencyMs: null, mode, tokenPrefix, message: "Mercado Pago no está configurado. Define MERCADO_PAGO_ACCESS_TOKEN y NEXT_PUBLIC_MP_PUBLIC_KEY en Vercel." };
  }

  if (!accessToken) {
    return { status: "unconfigured", publicKey, hasAccessToken: false, reachable: false, latencyMs: null, mode, tokenPrefix, message: "Falta MERCADO_PAGO_ACCESS_TOKEN para crear preferencias desde el servidor." };
  }

  const startedAt = Date.now();
  try {
    const response = await fetch(`${API_BASE}/v1/payment_methods?site_id=MLC`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    const latencyMs = Date.now() - startedAt;
    if (response.status === 401 || response.status === 403) {
      return { status: "invalid_token", publicKey, hasAccessToken: true, reachable: true, latencyMs, mode, tokenPrefix, message: "Mercado Pago rechazó el access token. Actualízalo en Vercel." };
    }
    if (!response.ok) {
      return { status: "unreachable", publicKey, hasAccessToken: true, reachable: false, latencyMs, mode, tokenPrefix, message: `Mercado Pago respondió con estado ${response.status}.` };
    }
    return { status: "ok", publicKey, hasAccessToken: true, reachable: true, latencyMs, mode, tokenPrefix, message: mode === "sandbox" ? "Conexión activa en modo TEST." : "Conexión activa con Mercado Pago." };
  } catch {
    return { status: "unreachable", publicKey, hasAccessToken: true, reachable: false, latencyMs: Date.now() - startedAt, mode, tokenPrefix, message: "No se pudo contactar con api.mercadopago.com." };
  }
}

function paymentItems(items: LineItem[], summary: CheckoutSummary) {
  const mapped = items.map((item) => ({
    id: String(item.productoId),
    title: item.nombre || `Producto ${item.productoId}`,
    quantity: Math.max(1, Number(item.cantidad || 1)),
    currency_id: summary.moneda,
    unit_price: Number(Number(item.precioUnitario || 0).toFixed(2)),
  }));
  if (summary.iva > 0) mapped.push({ id: "iva", title: "IVA", quantity: 1, currency_id: summary.moneda, unit_price: Number(summary.iva.toFixed(2)) });
  if (summary.despacho > 0) mapped.push({ id: "despacho", title: "Despacho", quantity: 1, currency_id: summary.moneda, unit_price: Number(summary.despacho.toFixed(2)) });
  return mapped;
}

async function mercadoPagoFetch<T>(path: string, init: RequestInit) {
  const accessToken = getMercadoPagoAccessToken();
  if (!accessToken) throw new Error("Falta configurar MERCADO_PAGO_ACCESS_TOKEN.");
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(data?.message || data?.error || `Mercado Pago respondió con estado ${response.status}.`);
  return data as T;
}

export async function createMercadoPagoPreference(params: { orderId: string; payload: CheckoutPayload; summary: CheckoutSummary }) {
  const baseUrl = getAppBaseUrl();
  const { orderId, payload, summary } = params;
  const body = {
    items: paymentItems(payload.items, summary),
    payer: {
      name: payload.cliente.nombre,
      email: payload.cliente.email,
      phone: payload.cliente.telefono ? { number: payload.cliente.telefono } : undefined,
    },
    external_reference: orderId,
    statement_descriptor: "OMNIFIX",
    notification_url: `${baseUrl}/api/webhooks/mercadopago`,
    back_urls: {
      success: `${baseUrl}/checkout?order=${encodeURIComponent(orderId)}&payment_status=success`,
      failure: `${baseUrl}/checkout?order=${encodeURIComponent(orderId)}&payment_status=failure`,
      pending: `${baseUrl}/checkout?order=${encodeURIComponent(orderId)}&payment_status=pending`,
    },
    auto_return: "approved",
    binary_mode: false,
    metadata: {
      order_id: orderId,
      region: payload.region,
      shipping_address: payload.shippingAddress || "",
    },
  };

  return mercadoPagoFetch<MercadoPagoPreferenceResult>("/checkout/preferences", { method: "POST", body: JSON.stringify(body) });
}

export async function getMercadoPagoPayment(paymentId: string) {
  return mercadoPagoFetch<{ id: string | number; status?: string; external_reference?: string }>(`/v1/payments/${paymentId}`, { method: "GET" });
}

export function mapMercadoPagoStatus(status?: string) {
  switch (status) {
    case "approved":
      return "pagada";
    case "rejected":
    case "cancelled":
      return "fallida";
    default:
      return "pendiente_pago";
  }
}
