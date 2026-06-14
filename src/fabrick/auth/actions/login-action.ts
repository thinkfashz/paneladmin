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
    const { getInsforgeConfig } = await import("@/fabrick/integrations/insforge/client");
    const config = getInsforgeConfig();

    if (config.baseUrl && config.apiKey) {
      try {
        const url = new URL(
          `/api/database/records/profiles?select=id,email,full_name,role,business_id,password_hash,is_active&email=eq.${encodeURIComponent(email)}&limit=1`,
          config.baseUrl,
        );
        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${config.apiKey}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const profiles = await res.json();
          if (Array.isArray(profiles) && profiles.length > 0) {
            profile = profiles[0];
          }
        }
      } catch (err) {
        console.error("[auth] Fallo la consulta de perfil en InsForge.", err instanceof Error ? err.message : err);
      }
    }
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
