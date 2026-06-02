import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";

export async function proxy(request: NextRequest) {
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
  // Ejecutamos writeActivityRecord de manera asíncrona para no bloquear la respuesta principal
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
      void writeActivityRecord({
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

  // Phase two checks will go here (Require Auth logic, etc.)
  // No bloqueamos por ahora agresivamente hasta que todo el auth real esté listo.

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
