import type { AuthRole } from "./roles";

export type AuthSessionUser = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  businessId?: string | null;
  role: AuthRole;
};

export type AuthSessionState = {
  user: AuthSessionUser | null;
  isAuthenticated: boolean;
  isSuperadmin: boolean;
  businessId?: string | null;
};

export function createEmptySession(): AuthSessionState {
  return {
    user: null,
    isAuthenticated: false,
    isSuperadmin: false,
    businessId: null,
  };
}

export function createSessionState(user: AuthSessionUser | null): AuthSessionState {
  return {
    user,
    isAuthenticated: Boolean(user),
    isSuperadmin: user?.role === "superadmin",
    businessId: user?.businessId ?? null,
  };
}
