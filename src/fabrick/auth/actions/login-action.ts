"use server";

import { cookies } from "next/headers";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";
import { supabaseRest } from "@/fabrick/integrations/supabase/rest";
import { checkRateLimit, createRateLimitKey, RATE_LIMITS } from "@/fabrick/security/rate-limit";
import { getSessionSecret } from "@/fabrick/setup/config-store";

import { getAuthProvider } from "../provider";
import type { AuthRole } from "../roles";
import { createSessionToken, getSessionCookieOptions, SESSION_COOKIE_NAME } from "../token";

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  role: AuthRole;
  business_id: string | null;
  password_hash: string | null;
  is_active?: boolean;
};

const GENERIC_FAILURE = {
  ok: false,
  message: "Credenciales invalidas o proveedor no configurado correctamente.",
};

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function getInsForgeLoginConfig() {
  return {
    url: process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL || process.env.INSFORGE_BASE_URL,
    apiKey: process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY,
  };
}

function sqlString(value: string) {
  return `'${value.replace(/'/g, "''")}'`;
}

function extractRows(data: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(data)) return data as Array<Record<string, unknown>>;

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (Array.isArray(obj.data)) return obj.data as Array<Record<string, unknown>>;
    if (Array.isArray(obj.rows)) return obj.rows as Array<Record<string, unknown>>;

    if (obj.result && typeof obj.result === "object") {
      const result = obj.result as Record<string, unknown>;
      if (Array.isArray(result.rows)) return result.rows as Array<Record<string, unknown>>;
      if (Array.isArray(result.data)) return result.data as Array<Record<string, unknown>>;
    }
  }

  return [];
}

async function findInsForgeProfile(email: string): Promise<ProfileRow | null> {
  const config = getInsForgeLoginConfig();

  if (!config.url || !config.apiKey) {
    console.error("[auth] InsForge no esta configurado para login. Faltan URL o API key.");
    return null;
  }

  const query = `
    select id, email, full_name, role, business_id, password_hash, is_active
    from public.profiles
    where email = ${sqlString(email)}
    limit 1
  `;

  try {
    const response = await fetch(`${normalizeUrl(config.url)}/api/database/advance/rawsql/unrestricted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
      },
      body: JSON.stringify({ query }),
      cache: "no-store",
    });

    const text = await response.text();
    let data: unknown = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      console.error("[auth] InsForge respondio con error al buscar perfil.", response.status, data);
      return null;
    }

    const rows = extractRows(data);
    const row = rows[0];

    if (!row) return null;

    return {
      id: String(row.id ?? ""),
      email: String(row.email ?? email),
      full_name: row.full_name ? String(row.full_name) : null,
      role: String(row.role ?? "admin") as AuthRole,
      business_id: row.business_id ? String(row.business_id) : null,
      password_hash: row.password_hash ? String(row.password_hash) : null,
      is_active: row.is_active === false ? false : true,
    };
  } catch (err) {
    console.error("[auth] Fallo la consulta de perfil en InsForge.", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function loginAction(email: string, password: string) {
  const provider = getAuthProvider();
  const activityMetadata = { email_attempted: email, provider };

  const rate = checkRateLimit({
    key: createRateLimitKey(["login", email.toLowerCase()]),
    ...RATE_LIMITS.LOGIN_ATTEMPT,
  });

  if (!rate.allowed) {
    await writeActivityRecord({
      eventType: "login_rate_limited",
      path: "/auth/v1/login",
      method: "POST",
      userEmail: email,
      metadata: activityMetadata,
    });

    return { ok: false, message: "Demasiados intentos. Espera unos minutos y vuelve a intentar." };
  }

  // Modo desarrollo / Superadmin: bloqueado de forma permanente en produccion.
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_SUPERADMIN_MODE === "true" &&
    email === "dev@fabrick.local"
  ) {
    await writeActivityRecord({
      eventType: "login_success",
      path: "/auth/v1/login",
      method: "POST",
      userEmail: email,
      metadata: activityMetadata,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, "dev-superadmin-token", getSessionCookieOptions());

    return { ok: true, message: "Inicio de sesión exitoso (Dev Superadmin)." };
  }

  const secret = getSessionSecret();
  if (!secret) {
    console.error("[auth] ACCESS_LOG_SECRET no esta configurado; login deshabilitado.");
    return GENERIC_FAILURE;
  }

  let profile: ProfileRow | null = null;

  if (provider === "supabase") {
    const result = await supabaseRest<ProfileRow[]>(
      `profiles?select=id,email,full_name,role,business_id,password_hash,is_active&email=eq.${encodeURIComponent(email)}&limit=1`,
    );

    if (result.ok && result.data && result.data.length > 0) {
      profile = result.data[0];
    }
  } else if (provider === "insforge") {
    profile = await findInsForgeProfile(email);
  }

  let sessionToken = "";

  if (profile && profile.password_hash && profile.is_active !== false) {
    const { compare } = await import("bcryptjs");
    const isValidPassword = await compare(password, profile.password_hash);

    if (isValidPassword) {
      sessionToken = await createSessionToken(
        {
          id: profile.id,
          email: profile.email ?? email,
          fullName: profile.full_name,
          role: profile.role,
          businessId: profile.business_id,
        },
        secret,
      );
    }
  }

  if (!sessionToken) {
    await writeActivityRecord({
      eventType: "login_failed",
      path: "/auth/v1/login",
      method: "POST",
      userEmail: email,
      metadata: activityMetadata,
    });

    return GENERIC_FAILURE;
  }

  await writeActivityRecord({
    eventType: "login_success",
    path: "/auth/v1/login",
    method: "POST",
    userEmail: email,
    metadata: activityMetadata,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, getSessionCookieOptions());

  return { ok: true, message: "Inicio de sesión exitoso." };
}
