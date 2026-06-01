export const AUTH_ROLES = {
  SUPERADMIN: "superadmin",
  BUSINESS_OWNER: "business_owner",
  STAFF: "staff",
  DEMO_VIEWER: "demo_viewer",
} as const;

export type AuthRole = (typeof AUTH_ROLES)[keyof typeof AUTH_ROLES];

export const protectedRoles: AuthRole[] = [
  AUTH_ROLES.SUPERADMIN,
  AUTH_ROLES.BUSINESS_OWNER,
  AUTH_ROLES.STAFF,
];

export function isAuthRole(value: unknown): value is AuthRole {
  return typeof value === "string" && Object.values(AUTH_ROLES).includes(value as AuthRole);
}

export function isSuperadmin(role?: string | null) {
  return role === AUTH_ROLES.SUPERADMIN;
}

export function isBusinessUser(role?: string | null) {
  return role === AUTH_ROLES.BUSINESS_OWNER || role === AUTH_ROLES.STAFF;
}
