import type { AuthRole } from "./roles";

export type CurrentAuthUser = {
  id: string;
  email?: string | null;
  fullName?: string | null;
  role: AuthRole;
  businessId?: string | null;
  provider: "insforge" | "supabase" | "pocketbase" | "none";
};

export type AuthLookupResult = {
  ok: boolean;
  user: CurrentAuthUser | null;
  message: string;
};

export type AuthRequestContext = {
  headers?: Headers;
  cookies?: Record<string, string | undefined>;
};
