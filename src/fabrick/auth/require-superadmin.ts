import { getCurrentUser } from "./get-current-user";
import { AUTH_ROLES } from "./roles";
import type { AuthRequestContext } from "./types";

export type RequireSuperadminResult = {
  allowed: boolean;
  reason?: string;
  userId?: string;
  userEmail?: string | null;
};

export async function requireSuperadminAuth(context: AuthRequestContext = {}): Promise<RequireSuperadminResult> {
  const result = await getCurrentUser(context);

  if (!result.user) {
    return {
      allowed: false,
      reason: "Usuario no autenticado.",
    };
  }

  if (result.user.role !== AUTH_ROLES.SUPERADMIN) {
    return {
      allowed: false,
      reason: "Rol insuficiente. Se requiere superadmin.",
      userId: result.user.id,
      userEmail: result.user.email,
    };
  }

  return {
    allowed: true,
    userId: result.user.id,
    userEmail: result.user.email,
  };
}
