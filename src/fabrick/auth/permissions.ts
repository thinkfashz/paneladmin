import { AUTH_ROLES, type AuthRole } from "./roles";

export const AUTH_PERMISSIONS = {
  MANAGE_PLATFORM: "manage_platform",
  MANAGE_BUSINESS: "manage_business",
  MANAGE_BRANDING: "manage_branding",
  MANAGE_PRODUCTS: "manage_products",
  MANAGE_CUSTOMERS: "manage_customers",
  MANAGE_APPOINTMENTS: "manage_appointments",
  MANAGE_QUOTES: "manage_quotes",
  VIEW_DEMO: "view_demo",
  CONVERT_DEMO: "convert_demo",
} as const;

export type AuthPermission = (typeof AUTH_PERMISSIONS)[keyof typeof AUTH_PERMISSIONS];

export const rolePermissions: Record<AuthRole, AuthPermission[]> = {
  [AUTH_ROLES.SUPERADMIN]: Object.values(AUTH_PERMISSIONS),
  [AUTH_ROLES.BUSINESS_OWNER]: [
    AUTH_PERMISSIONS.MANAGE_BUSINESS,
    AUTH_PERMISSIONS.MANAGE_BRANDING,
    AUTH_PERMISSIONS.MANAGE_PRODUCTS,
    AUTH_PERMISSIONS.MANAGE_CUSTOMERS,
    AUTH_PERMISSIONS.MANAGE_APPOINTMENTS,
    AUTH_PERMISSIONS.MANAGE_QUOTES,
  ],
  [AUTH_ROLES.STAFF]: [
    AUTH_PERMISSIONS.MANAGE_PRODUCTS,
    AUTH_PERMISSIONS.MANAGE_CUSTOMERS,
    AUTH_PERMISSIONS.MANAGE_APPOINTMENTS,
  ],
  [AUTH_ROLES.DEMO_VIEWER]: [AUTH_PERMISSIONS.VIEW_DEMO],
};

export function hasPermission(role: AuthRole | null | undefined, permission: AuthPermission) {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: AuthRole | null | undefined, permissions: AuthPermission[]) {
  return permissions.some((permission) => hasPermission(role, permission));
}
