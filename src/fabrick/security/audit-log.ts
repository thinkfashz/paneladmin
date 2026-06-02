import { sha256 } from "./hash";

export type AuditEventType =
  | "demo_opened"
  | "demo_denied"
  | "admin_opened"
  | "login_attempt"
  | "rate_limited"
  | "token_created"
  | "token_expired"
  | "security_warning";

export type AuditEventInput = {
  businessId?: string | null;
  eventType: AuditEventType;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
};

export type AuditEventPayload = {
  business_id?: string | null;
  event_type: AuditEventType;
  metadata: Record<string, unknown>;
  ip_hash?: string | null;
  user_agent?: string | null;
  created_at: string;
};

export async function createAuditEventPayload(input: AuditEventInput): Promise<AuditEventPayload> {
  const ip_hash = input.ip ? await sha256(input.ip) : null;
  return {
    business_id: input.businessId ?? null,
    event_type: input.eventType,
    metadata: input.metadata ?? {},
    ip_hash,
    user_agent: input.userAgent ?? null,
    created_at: new Date().toISOString(),
  };
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;

  return headers.get("x-real-ip") ?? null;
}

export function getUserAgent(headers: Headers) {
  return headers.get("user-agent") ?? null;
}

// Esta funcion queda como adaptador neutral. El proveedor real debe implementarse
// en InsForge, Supabase o PocketBase segun la conexion activa.
export async function writeAuditEvent(input: AuditEventInput) {
  const payload = await createAuditEventPayload(input);

  if (process.env.NODE_ENV !== "production") {
    console.info("[audit-event]", payload);
  }

  return payload;
}
