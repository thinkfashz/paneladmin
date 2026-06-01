import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getSupabaseCurrentUser(_context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      ok: false,
      user: null,
      message: "Supabase auth no configurado.",
    };
  }

  // TODO: Conectar con @supabase/ssr y leer usuario real desde cookies del servidor.
  // Luego consultar profiles para obtener role y business_id.
  return {
    ok: false,
    user: null,
    message: "Supabase auth pendiente de conexion real con cookies server-side.",
  };
}
