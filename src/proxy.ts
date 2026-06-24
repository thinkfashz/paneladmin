import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";
import { canRunSetup, isSetupComplete } from "@/fabrick/setup/config-store";

export default async function proxy(request: NextRequest) {
  // Aplicar headers de seguridad básicos
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Omitir registro para archivos estáticos y rutas internas de Next.js
  if (
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.includes(".") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return response;
  }

  const pathname = request.nextUrl.pathname;

  // Primer inicio: el setup protege solo rutas internas del panel.
  // La portada pública de tienda (/) debe poder cargar sin mostrar el admin.
  const setupDone = isSetupComplete();

  if (pathname.startsWith("/setup")) {
    if (!canRunSetup()) {
      return NextResponse.redirect(new URL("/auth/v1/login", request.url));
    }
    return response;
  }

  if (
    !setupDone &&
    (pathname.startsWith("/auth") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/superadmin"))
  ) {
    return NextResponse.redirect(new URL("/setup", request.url));
  }

  // Registrar activity suavemente sin bloquear
  try {
    const ip = request.headers.get("x-forwarded-for") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const referer = request.headers.get("referer") || null;

    // Solo logeamos accesos al panel, superadmin y login por ahora (fase uno)
    if (
      pathname.startsWith("/superadmin") ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/auth")
    ) {
      await writeActivityRecord({
        eventType: "page_view",
        path: pathname,
        method: request.method,
        ip,
        userAgent,
        referer,
      });
    }
  } catch (err) {
    console.error("Error al registrar actividad en proxy", err);
  }

  // Phase two checks: Require Auth logic
  const isSuperadminRoute = pathname.startsWith("/superadmin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isSuperadminRoute || isDashboardRoute || isAdminRoute) {
    const allCookies = request.cookies.getAll();
    const cookieObj = Object.fromEntries(allCookies.map((c) => [c.name, c.value]));

    const { getCurrentUser } = await import("@/fabrick/auth/get-current-user");
    const authResult = await getCurrentUser({ cookies: cookieObj });

    if (!authResult.user) {
      const loginUrl = new URL("/auth/v1/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    if (isSuperadminRoute && authResult.user.role !== "superadmin") {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.rewrite(unauthorizedUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
