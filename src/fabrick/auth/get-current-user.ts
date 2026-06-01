import { getAuthProvider } from "./provider";
import type { AuthLookupResult, AuthRequestContext } from "./types";
import { createDevInsforgeSuperadmin, getInsforgeCurrentUser } from "./adapters/insforge-auth-adapter";
import { getPocketBaseCurrentUser } from "./adapters/pocketbase-auth-adapter";
import { getSupabaseCurrentUser } from "./adapters/supabase-auth-adapter";

export async function getCurrentUser(context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  const devSuperadmin = createDevInsforgeSuperadmin();
  if (devSuperadmin.ok) return devSuperadmin;

  const provider = getAuthProvider();

  if (provider === "insforge") {
    return getInsforgeCurrentUser(context);
  }

  if (provider === "supabase") {
    return getSupabaseCurrentUser(context);
  }

  if (provider === "pocketbase") {
    return getPocketBaseCurrentUser(context);
  }

  return {
    ok: false,
    user: null,
    message: "No hay proveedor auth configurado.",
  };
}
