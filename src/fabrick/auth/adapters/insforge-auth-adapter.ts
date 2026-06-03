import { AUTH_ROLES } from "../roles";
import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getInsforgeCurrentUser(context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!process.env.INSFORGE_BASE_URL || !process.env.INSFORGE_PROJECT_ID) {
    return {
      ok: false,
      user: null,
      message: "InsForge auth no configurado.",
    };
  }

  // Si existe sesion por cookie dev
  const sessionCookie = context.cookies?.fabrick_session;

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

  // Decodificación de sesión con validación de firma
  try {
    const parts = sessionCookie.split(".");
    if (parts.length !== 2) {
      throw new Error("Invalid token format");
    }

    const [base64Payload, incomingSignature] = parts;

    const { hmacSha256 } = await import("@/fabrick/security/hash");
    const secret = process.env.ACCESS_LOG_SECRET || "dev_secret";

    // Verificamos que la firma del token no haya sido manipulada
    const expectedSignature = await hmacSha256(base64Payload, secret);

    if (incomingSignature !== expectedSignature) {
      throw new Error("Invalid token signature");
    }

    const payloadStr = atob(base64Payload);
    const payload = JSON.parse(payloadStr);

    return {
      ok: true,
      user: {
        id: payload.id,
        email: payload.email,
        fullName: payload.fullName || "User",
        role: payload.role,
        businessId: payload.businessId || null,
        provider: "insforge",
      },
      message: "Sesión validada correctamente.",
    };
  } catch (_err) {
    return {
      ok: false,
      user: null,
      message: "Error al validar la firma de sesión.",
    };
  }
}

export function createDevInsforgeSuperadmin(): AuthLookupResult {
  if (process.env.DEV_SUPERADMIN_MODE !== "true") {
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
