export type RouteAccessType = "public" | "auth" | "superadmin" | "demo-token" | "api-private";

export type RouteProtectionRule = {
  pattern: string;
  access: RouteAccessType;
  description: string;
};

export const routeProtectionRules: RouteProtectionRule[] = [
  {
    pattern: "/superadmin",
    access: "superadmin",
    description: "Panel maestro. Solo usuarios con rol superadmin.",
  },
  {
    pattern: "/admin",
    access: "auth",
    description: "Panel de negocio. Requiere usuario autenticado y business_id.",
  },
  {
    pattern: "/demo",
    access: "demo-token",
    description: "Demo temporal. Requiere slug y token valido.",
  },
  {
    pattern: "/api/private",
    access: "api-private",
    description: "APIs internas. Requieren autenticacion o secreto de servidor.",
  },
];

export function getRouteAccessType(pathname: string): RouteAccessType {
  const match = routeProtectionRules.find((rule) => pathname.startsWith(rule.pattern));
  return match?.access ?? "public";
}

export function isProtectedPath(pathname: string) {
  return getRouteAccessType(pathname) !== "public";
}

export function isSuperadminPath(pathname: string) {
  return getRouteAccessType(pathname) === "superadmin";
}

export function isDemoPath(pathname: string) {
  return getRouteAccessType(pathname) === "demo-token";
}

export function isPrivateApiPath(pathname: string) {
  return getRouteAccessType(pathname) === "api-private";
}
