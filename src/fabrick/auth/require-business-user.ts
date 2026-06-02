import { getCurrentUser } from "./get-current-user";
import { AUTH_ROLES } from "./roles";
import type { AuthRequestContext } from "./types";

export type RequireBusinessUserResult = {
  allowed: boolean;
  reason?: string;
  userId?: string;
  businessId?: string | null;
};

export async function requireBusinessUserAuth(
  context: AuthRequestContext = {},
  businessId?: string | null,
): Promise<RequireBusinessUserResult> {
  const result = await getCurrentUser(context);

  if (!result.user) {
    return {
      allowed: false,
      reason: "Usuario no autenticado.",
    };
  }

  if (result.user.role === AUTH_ROLES.SUPERADMIN) {
    return {
      allowed: true,
      userId: result.user.id,
      businessId: result.user.businessId,
    };
  }

  if (result.user.role !== AUTH_ROLES.BUSINESS_OWNER && result.user.role !== AUTH_ROLES.STAFF) {
    return {
      allowed: false,
      reason: "Rol insuficiente para acceder al negocio.",
      userId: result.user.id,
      businessId: result.user.businessId,
    };
  }

  if (businessId && result.user.businessId !== businessId) {
    return {
      allowed: false,
      reason: "El usuario no pertenece a este negocio.",
      userId: result.user.id,
      businessId: result.user.businessId,
    };
  }

  return {
    allowed: true,
    userId: result.user.id,
    businessId: result.user.businessId,
  };
}
