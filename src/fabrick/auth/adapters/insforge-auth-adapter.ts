import { getInsforgeRuntimeConfig, getSessionSecret } from "@/fabrick/setup/config-store";

import { AUTH_ROLES } from "../roles";
import { SESSION_COOKIE_NAME, verifySessionToken } from "../token";
import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getInsforgeCurrentUser(context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!getInsforgeRuntimeConfig()) {
    return {
      ok: false,
      user: null,
      message: "InsForge auth no configurado.",
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

  if (sessionCookie === "dev-superadmin-token") {
    return createDevInsforgeSuperadmin();
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
      provider: "insforge",
    },
    message: "Sesión validada correctamente.",
  };
}

export function createDevInsforgeSuperadmin(): AuthLookupResult {
  // El bypass de desarrollo queda deshabilitado de forma permanente en produccion.
  if (process.env.NODE_ENV === "production" || process.env.DEV_SUPERADMIN_MODE !== "true") {
    return {
      ok: false,
      user: null,
      message: "Modo dev superadmin desactivado.",
    };
  }

  return {
    ok: true,
    user: {
      id: "dev-superadmin",
      email: "dev@fabrick.local",
      fullName: "Dev Superadmin",
      role: AUTH_ROLES.SUPERADMIN,
      businessId: null,
      provider: "insforge",
    },
    message: "Modo dev superadmin activo. No usar en produccion.",
  };
}
