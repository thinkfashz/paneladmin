import { hasPermission, type AuthPermission } from "./permissions";
import { AUTH_ROLES, type AuthRole } from "./roles";
import type { AuthSessionState } from "./session";

export type GuardResult = {
  allowed: boolean;
  reason?: string;
  redirectTo?: string;
};

export function requireAuthenticated(session: AuthSessionState): GuardResult {
  if (!session.isAuthenticated || !session.user) {
    return {
      allowed: false,
      reason: "Usuario no autenticado.",
      redirectTo: "/login",
    };
  }

  return { allowed: true };
}

export function requireRole(session: AuthSessionState, roles: AuthRole[]): GuardResult {
  const auth = requireAuthenticated(session);
  if (!auth.allowed) return auth;

  if (!session.user || !roles.includes(session.user.role)) {
    return {
      allowed: false,
      reason: "Rol no autorizado.",
      redirectTo: "/unauthorized",
    };
  }

  return { allowed: true };
}

export function requirePermission(session: AuthSessionState, permission: AuthPermission): GuardResult {
  const auth = requireAuthenticated(session);
  if (!auth.allowed) return auth;

  if (!hasPermission(session.user?.role, permission)) {
    return {
      allowed: false,
      reason: "Permiso insuficiente.",
      redirectTo: "/unauthorized",
    };
  }

  return { allowed: true };
}

export function requireSuperadmin(session: AuthSessionState): GuardResult {
  return requireRole(session, [AUTH_ROLES.SUPERADMIN]);
}

export function requireBusinessAccess(session: AuthSessionState, businessId: string): GuardResult {
  const auth = requireAuthenticated(session);
  if (!auth.allowed) return auth;

  if (session.user?.role === AUTH_ROLES.SUPERADMIN) return { allowed: true };

  if (session.user?.businessId !== businessId) {
    return {
      allowed: false,
      reason: "El usuario no pertenece a este negocio.",
      redirectTo: "/unauthorized",
    };
  }

  return { allowed: true };
}
