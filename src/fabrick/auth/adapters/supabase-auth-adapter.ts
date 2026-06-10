import { getSessionSecret, getSupabaseRuntimeConfig } from "@/fabrick/setup/config-store";

import { SESSION_COOKIE_NAME, verifySessionToken } from "../token";
import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getSupabaseCurrentUser(context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!getSupabaseRuntimeConfig()) {
    return {
      ok: false,
      user: null,
      message: "Supabase auth no configurado.",
    };
  }

  const sessionCookie = context.cookies?.[SESSION_COOKIE_NAME];
  if (!sessionCookie) {
    return {
      ok: false,
      user: null,
      message: "No hay sesión activa.",
    };
  }

  const secret = getSessionSecret();
  if (!secret) {
    return {
      ok: false,
      user: null,
      message: "Secreto de sesión no configurado.",
    };
  }

  const payload = await verifySessionToken(sessionCookie, secret);
  if (!payload) {
    return {
      ok: false,
      user: null,
      message: "Sesión inválida o expirada.",
    };
  }

  return {
    ok: true,
    user: {
      id: payload.id,
      email: payload.email,
      fullName: payload.fullName || "User",
      role: payload.role,
      businessId: payload.businessId ?? null,
      provider: "supabase",
    },
    message: "Sesión validada correctamente.",
  };
}
