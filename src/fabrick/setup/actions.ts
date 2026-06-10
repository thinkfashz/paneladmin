"use server";

import { z } from "zod";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";
import { checkTablesExist, testSupabaseCredentials } from "@/fabrick/integrations/supabase/rest";
import { checkRateLimit } from "@/fabrick/security/rate-limit";

import { canRunSetup, saveRuntimeConfig, writeSetupLock } from "./config-store";
import { REQUIRED_TABLES } from "./migration-sql";
import { randomBytes } from "node:crypto";

const credentialsSchema = z.object({
  supabaseUrl: z
    .string()
    .url({ message: "La URL no es valida." })
    .refine((value) => value.startsWith("https://"), { message: "La URL debe usar https://" }),
  supabaseAnonKey: z.string().min(20, { message: "La anon key parece incompleta." }),
  supabaseServiceRoleKey: z.string().min(20, { message: "La service role key parece incompleta." }),
});

const completeSetupSchema = credentialsSchema.extend({
  adminFullName: z.string().min(2, { message: "Ingresa tu nombre." }).max(120),
  adminEmail: z.string().email({ message: "Email invalido." }).max(254),
  adminPassword: z
    .string()
    .min(10, { message: "La contrasena debe tener al menos 10 caracteres." })
    .max(128)
    .regex(/[a-zA-Z]/, { message: "La contrasena debe incluir letras." })
    .regex(/[0-9]/, { message: "La contrasena debe incluir numeros." }),
});

export type SetupActionResult = {
  ok: boolean;
  message: string;
  missingTables?: string[];
  envBlock?: string;
};

function setupLocked(): SetupActionResult {
  return {
    ok: false,
    message:
      "La configuracion inicial ya fue completada y esta bloqueada. Usa FABRICK_SETUP_FORCE=true para reabrirla.",
  };
}

function setupRateLimited(): SetupActionResult | null {
  const result = checkRateLimit({ key: "setup:actions", limit: 30, windowMs: 60_000 });
  if (!result.allowed) {
    return { ok: false, message: "Demasiados intentos. Espera un minuto y vuelve a intentar." };
  }
  return null;
}

export async function testConnectionAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Credenciales invalidas." };
  }

  return testSupabaseCredentials(parsed.data.supabaseUrl, parsed.data.supabaseServiceRoleKey);
}

export async function verifyMigrationAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Credenciales invalidas." };
  }

  const result = await checkTablesExist(parsed.data.supabaseUrl, parsed.data.supabaseServiceRoleKey, REQUIRED_TABLES);

  if (!result.ok) {
    return {
      ok: false,
      message: "Faltan tablas por crear. Ejecuta el SQL de migracion en el SQL Editor de Supabase.",
      missingTables: result.missing,
    };
  }

  return { ok: true, message: "Migracion verificada: todas las tablas existen." };
}

export async function completeSetupAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const parsed = completeSetupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos invalidos." };
  }

  const { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey, adminFullName, adminEmail, adminPassword } =
    parsed.data;
  const baseUrl = supabaseUrl.replace(/\/$/, "");

  const connection = await testSupabaseCredentials(baseUrl, supabaseServiceRoleKey);
  if (!connection.ok) return connection;

  const tables = await checkTablesExist(baseUrl, supabaseServiceRoleKey, REQUIRED_TABLES);
  if (!tables.ok) {
    return {
      ok: false,
      message: "La migracion no esta completa. Ejecuta el SQL en Supabase antes de finalizar.",
      missingTables: tables.missing,
    };
  }

  const serviceHeaders = {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    "Content-Type": "application/json",
  };

  // Crea (o conserva) la cuenta superadmin con la contrasena hasheada.
  const { hash } = await import("bcryptjs");
  const passwordHash = await hash(adminPassword, 12);

  try {
    const existingRes = await fetch(
      `${baseUrl}/rest/v1/profiles?select=id,role&email=eq.${encodeURIComponent(adminEmail)}`,
      { headers: serviceHeaders, cache: "no-store" },
    );
    const existing = existingRes.ok ? await existingRes.json() : [];

    if (Array.isArray(existing) && existing.length > 0) {
      const updateRes = await fetch(`${baseUrl}/rest/v1/profiles?id=eq.${existing[0].id}`, {
        method: "PATCH",
        headers: { ...serviceHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({
          full_name: adminFullName,
          password_hash: passwordHash,
          role: "superadmin",
          is_active: true,
        }),
      });

      if (!updateRes.ok) {
        return { ok: false, message: `No se pudo actualizar la cuenta admin (estado ${updateRes.status}).` };
      }
    } else {
      const insertRes = await fetch(`${baseUrl}/rest/v1/profiles`, {
        method: "POST",
        headers: { ...serviceHeaders, Prefer: "return=minimal" },
        body: JSON.stringify({
          email: adminEmail,
          full_name: adminFullName,
          password_hash: passwordHash,
          role: "superadmin",
          is_active: true,
        }),
      });

      if (!insertRes.ok) {
        return { ok: false, message: `No se pudo crear la cuenta admin (estado ${insertRes.status}).` };
      }
    }
  } catch (err) {
    return {
      ok: false,
      message:
        err instanceof Error ? `Error creando la cuenta admin: ${err.message}` : "Error creando la cuenta admin.",
    };
  }

  // Secreto de sesion: respeta el del entorno si existe, si no genera uno fuerte.
  const accessLogSecret = process.env.ACCESS_LOG_SECRET || randomBytes(48).toString("hex");

  saveRuntimeConfig({
    provider: "supabase",
    supabaseUrl: baseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey,
    accessLogSecret,
    adminEmail,
    configuredAt: new Date().toISOString(),
  });

  // Candado: a partir de aqui el asistente queda bloqueado.
  writeSetupLock(adminEmail);

  await writeActivityRecord({
    eventType: "setup_completed",
    path: "/setup",
    method: "POST",
    userEmail: adminEmail,
    metadata: { provider: "supabase" },
  });

  const envBlock = [
    "# Copia estas variables a tus secretos (Vercel, .env.local, etc.).",
    "# Si estan presentes en el entorno, SIEMPRE tienen prioridad sobre lo guardado en el panel.",
    `NEXT_PUBLIC_SUPABASE_URL=${baseUrl}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}`,
    `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceRoleKey}`,
    `ACCESS_LOG_SECRET=${accessLogSecret}`,
  ].join("\n");

  return {
    ok: true,
    message: "Configuracion completada. Tu cuenta de administrador esta lista.",
    envBlock,
  };
}
