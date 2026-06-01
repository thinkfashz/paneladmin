import { AUTH_ROLES } from "../roles";
import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getInsforgeCurrentUser(_context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!process.env.INSFORGE_BASE_URL || !process.env.INSFORGE_PROJECT_ID) {
    return {
      ok: false,
      user: null,
      message: "InsForge auth no configurado.",
    };
  }

  // TODO: Conectar con sesion real de InsForge cuando el proyecto tenga auth definido.
  // Nunca confiar en datos enviados por cliente para rol superadmin.
  return {
    ok: false,
    user: null,
    message: "InsForge auth pendiente de conexion real.",
  };
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
