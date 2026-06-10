// Tokens de sesion firmados (HMAC-SHA256) con expiracion.
// Solo servidor: la verificacion ocurre en proxy y server actions.

import { hmacSha256, safeCompare } from "@/fabrick/security/hash";

import type { AuthRole } from "./roles";

export const SESSION_COOKIE_NAME = "fabrick_session";
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

export type SessionTokenPayload = {
  id: string;
  email: string | null;
  fullName?: string | null;
  role: AuthRole;
  businessId: string | null;
  exp: number;
};

export async function createSessionToken(
  payload: Omit<SessionTokenPayload, "exp">,
  secret: string,
  maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS,
): Promise<string> {
  const fullPayload: SessionTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };

  const base64Payload = Buffer.from(JSON.stringify(fullPayload), "utf8").toString("base64url");
  const signature = await hmacSha256(base64Payload, secret);

  return `${base64Payload}.${signature}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<SessionTokenPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [base64Payload, incomingSignature] = parts;
    const expectedSignature = await hmacSha256(base64Payload, secret);

    if (!safeCompare(incomingSignature, expectedSignature)) return null;

    const payload = JSON.parse(Buffer.from(base64Payload, "base64url").toString("utf8")) as SessionTokenPayload;

    if (typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(maxAgeSeconds: number = SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
