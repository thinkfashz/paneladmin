import type { AuthLookupResult, AuthRequestContext } from "../types";

export async function getPocketBaseCurrentUser(_context: AuthRequestContext = {}): Promise<AuthLookupResult> {
  if (!process.env.POCKETBASE_URL) {
    return {
      ok: false,
      user: null,
      message: "PocketBase auth no configurado.",
    };
  }

  // TODO: Leer cookie/token de PocketBase y validar usuario real.
  // Luego consultar perfil/rol asociado.
  return {
    ok: false,
    user: null,
    message: "PocketBase auth pendiente de conexion real.",
  };
}
