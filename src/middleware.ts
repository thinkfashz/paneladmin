import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";

export async function middleware(request: NextRequest) {
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

  // Registrar activity suavemente sin bloquear
  try {
    const ip = request.headers.get("x-forwarded-for") || null;
    const userAgent = request.headers.get("user-agent") || null;
    const referer = request.headers.get("referer") || null;

    // Solo logeamos accesos al panel, superadmin y login por ahora (fase uno)
    if (
      request.nextUrl.pathname.startsWith("/superadmin") ||
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/auth")
    ) {
      // In Next.js middleware (Edge) we should wait for promises or use executionCtx.waitUntil
      // We will await the logging to ensure it safely resolves before edge workers terminate
      await writeActivityRecord({
        eventType: "page_view",
        path: request.nextUrl.pathname,
        method: request.method,
        ip,
        userAgent,
        referer,
      });
    }
  } catch (err) {
    console.error("Error al registrar actividad en middleware", err);
  }

  // Phase two checks: Require Auth logic
  const isSuperadminRoute = request.nextUrl.pathname.startsWith("/superadmin");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isSuperadminRoute || isDashboardRoute) {
    // Extract cookies from the incoming request for Edge compatibility
    const allCookies = request.cookies.getAll();
    const cookieObj = Object.fromEntries(allCookies.map((c) => [c.name, c.value]));

    // Import lazily to avoid Edge runtime module loading errors
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
