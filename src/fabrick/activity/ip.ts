import { sha256 } from "@/fabrick/security/hash";

export function getActivityIpFromHeaders(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;

  return headers.get("x-real-ip") ?? headers.get("cf-connecting-ip") ?? null;
}

export function maskActivityIp(ip?: string | null) {
  if (!ip) return null;

  const parts = ip.split(".");
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.0`;

  return "masked";
}

export async function hashActivityIp(ip?: string | null) {
  if (!ip) return null;

  const secret = process.env.ACCESS_LOG_SECRET ?? process.env.DEMO_TOKEN_SECRET ?? "not-configured";
  return sha256(`${secret}:${ip}`);
}
