import { cookies } from "next/headers";

import { createDevInsforgeSuperadmin, getInsforgeCurrentUser } from "./adapters/insforge-auth-adapter";
import { getPocketBaseCurrentUser } from "./adapters/pocketbase-auth-adapter";
import { getSupabaseCurrentUser } from "./adapters/supabase-auth-adapter";
import { getAuthProvider } from "./provider";
import type { AuthLookupResult, AuthRequestContext } from "./types";

export async function getCurrentUser(context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  const devSuperadmin = createDevInsforgeSuperadmin();
  if (devSuperadmin.ok) return devSuperadmin;

  // Extract cookies globally if not provided in context directly
  let resolvedCookies = context.cookies;
  if (!resolvedCookies) {
    try {
      const store = await cookies();
      resolvedCookies = Object.fromEntries(store.getAll().map((c) => [c.name, c.value]));
    } catch {
      resolvedCookies = {};
    }
  }

  const enrichedContext = { ...context, cookies: resolvedCookies };

  const provider = getAuthProvider();

  if (provider === "insforge") {
    return getInsforgeCurrentUser(enrichedContext);
  }

  if (provider === "supabase") {
    return getSupabaseCurrentUser(enrichedContext);
  }

  if (provider === "pocketbase") {
    return getPocketBaseCurrentUser(enrichedContext);
  }

  return {
    ok: false,
    user: null,
    message: "No hay proveedor auth configurado.",
  };
}
