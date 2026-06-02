import { sha256 } from "./hash";

export type AccessLogEventType =
  | "page_view"
  | "api_request"
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "demo_access"
  | "demo_denied"
  | "admin_access"
  | "blocked_request";

export type AccessLogInput = {
  eventType: AccessLogEventType;
  path: string;
  method?: string;
  userId?: string | null;
  userEmail?: string | null;
  businessId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  metadata?: Record<string, unknown>;
};

export type AccessLogPayload = {
  event_type: AccessLogEventType;
  path: string;
  method: string;
  user_id?: string | null;
  user_email?: string | null;
  business_id?: string | null;
  ip_hash?: string | null;
  ip_masked?: string | null;
  user_agent?: string | null;
  device_type: "mobile" | "tablet" | "desktop" | "bot" | "unknown";
  browser_family: string;
  os_family: string;
  referer?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export function getClientIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? null;
}

export function getDeviceType(userAgent?: string | null): AccessLogPayload["device_type"] {
  const ua = userAgent?.toLowerCase() ?? "";
  if (!ua) return "unknown";
  if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider")) return "bot";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "mobile";
  return "desktop";
}

export function getBrowserFamily(userAgent?: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";
  return "Unknown";
}

export function getOsFamily(userAgent?: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  return "Unknown";
}

export function maskIp(ip?: string | null) {
  if (!ip) return null;
  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
  return "masked";
}

export async function createAccessLogPayload(input: AccessLogInput): Promise<AccessLogPayload> {
  const secret = process.env.ACCESS_LOG_SECRET ?? "not-configured";
  const ip_hash = input.ip ? await sha256(`${secret}:${input.ip}`) : null;

  return {
    event_type: input.eventType,
    path: input.path,
    method: input.method ?? "GET",
    user_id: input.userId ?? null,
    user_email: input.userEmail ?? null,
    business_id: input.businessId ?? null,
    ip_hash,
    ip_masked: maskIp(input.ip),
    user_agent: input.userAgent ?? null,
    device_type: getDeviceType(input.userAgent),
    browser_family: getBrowserFamily(input.userAgent),
    os_family: getOsFamily(input.userAgent),
    referer: input.referer ?? null,
    metadata: input.metadata ?? {},
    created_at: new Date().toISOString(),
  };
}

export async function writeAccessLog(input: AccessLogInput) {
  const payload = await createAccessLogPayload(input);

  if (process.env.NODE_ENV !== "production") {
    console.info("[access-log]", payload);
  }

  return payload;
}
