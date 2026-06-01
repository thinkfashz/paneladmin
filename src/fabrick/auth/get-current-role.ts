import { getCurrentUser } from "./get-current-user";
import type { AuthRequestContext } from "./types";

export async function getCurrentRole(context: AuthRequestContext = {}) {
  const result = await getCurrentUser(context);
  return result.user?.role ?? null;
}

export async function getCurrentBusinessId(context: AuthRequestContext = {}) {
  const result = await getCurrentUser(context);
  return result.user?.businessId ?? null;
}
