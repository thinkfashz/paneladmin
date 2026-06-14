"use server";

import { randomBytes } from "node:crypto";

import { z } from "zod";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";
import {
  checkDatabaseTablesExist,
  getAllProviderEnvStatuses,
  getEnvProvider,
  resolveDatabaseCredentials,
  testDatabaseCredentials,
  upsertAdminProfile,
  type DatabaseProvider,
} from "@/fabrick/integrations/database/provider";
import { checkRateLimit } from "@/fabrick/security/rate-limit";

import { canRunSetup, saveRuntimeConfig, writeSetupLock } from "./config-store";
import { REQUIRED_TABLES } from "./migration-sql";

const credentialsSchema = z.object({
  provider: z.enum(["supabase", "insforge"]).default("supabase"),
  url: z.string().optional().default(""),
  anonKey: z.string().optional().default(""),
  serviceRoleKey: z.string().optional().default(""),
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
  envStatuses?: ReturnType<typeof getAllProviderEnvStatuses>;
  envProvider?: ReturnType<typeof getEnvProvider>;
  provider?: DatabaseProvider;
  usingEnv?: boolean;
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
  if (!result.allowed) return { ok: false, message: "Demasiados intentos. Espera un minuto y vuelve a intentar." };
  return null;
}

function resolveInput(input: unknown) {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, message: parsed.error.issues[0]?.message ?? "Credenciales invalidas." };
  }

  const credentials = resolveDatabaseCredentials(parsed.data);
  if (!credentials) {
    return { ok: false as const, message: "Faltan credenciales para el proveedor seleccionado." };
  }

  return {
    ok: true as const,
    credentials,
    usingEnv: !parsed.data.url && !parsed.data.anonKey && !parsed.data.serviceRoleKey,
  };
}

export async function getSetupEnvStatusAction(): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  return {
    ok: true,
    message: "Estado de variables de entorno detectado.",
    envStatuses: getAllProviderEnvStatuses(),
    envProvider: getEnvProvider(),
  };
}

export async function testConnectionAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const resolved = resolveInput(input);
  if (!resolved.ok) return { ok: false, message: resolved.message };

  const result = await testDatabaseCredentials(resolved.credentials);
  return { ...result, provider: resolved.credentials.provider, usingEnv: resolved.usingEnv };
}

export async function verifyMigrationAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const resolved = resolveInput(input);
  if (!resolved.ok) return { ok: false, message: resolved.message };

  const result = await checkDatabaseTablesExist(resolved.credentials, REQUIRED_TABLES);
  if (!result.ok) {
    return {
      ok: false,
      message: `Faltan tablas por crear en ${resolved.credentials.provider}. Ejecuta el SQL de migracion.`,
      missingTables: result.missing,
      provider: resolved.credentials.provider,
      usingEnv: resolved.usingEnv,
    };
  }

  return {
    ok: true,
    message: `Migracion verificada en ${resolved.credentials.provider}: todas las tablas existen.`,
    provider: resolved.credentials.provider,
    usingEnv: resolved.usingEnv,
  };
}

export async function completeSetupAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const parsed = completeSetupSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Datos invalidos." };

  const resolved = resolveInput(parsed.data);
  if (!resolved.ok) return { ok: false, message: resolved.message };

  const credentials = resolved.credentials;

  const connection = await testDatabaseCredentials(credentials);
  if (!connection.ok) return connection;

  const tables = await checkDatabaseTablesExist(credentials, REQUIRED_TABLES);
  if (!tables.ok) {
    return {
      ok: false,
      message: `La migracion no esta completa en ${credentials.provider}. Ejecuta el SQL antes de finalizar.`,
      missingTables: tables.missing,
    };
  }

  const { hash } = await import("bcryptjs");
  const passwordHash = await hash(parsed.data.adminPassword, 12);

  const adminProfile = await upsertAdminProfile(credentials, {
    email: parsed.data.adminEmail,
    fullName: parsed.data.adminFullName,
    passwordHash,
  });
  if (!adminProfile.ok) return adminProfile;

  const accessLogSecret = process.env.ACCESS_LOG_SECRET || randomBytes(48).toString("hex");

  saveRuntimeConfig({
    provider: "supabase",
    supabaseUrl: credentials.provider === "supabase" ? credentials.url : "",
    supabaseAnonKey: credentials.provider === "supabase" ? credentials.anonKey : "",
    supabaseServiceRoleKey: credentials.provider === "supabase" ? credentials.serviceRoleKey : "",
    accessLogSecret,
    adminEmail: parsed.data.adminEmail,
    configuredAt: new Date().toISOString(),
  });

  writeSetupLock(parsed.data.adminEmail);

  await writeActivityRecord({
    eventType: "setup_completed",
    path: "/setup",
    method: "POST",
    userEmail: parsed.data.adminEmail,
    metadata: { provider: credentials.provider, usingEnv: resolved.usingEnv },
  });

  const envBlock = [
    "# Copia estas variables a tus secretos (Vercel, .env.local, etc.).",
    "# Si estan presentes en el entorno, SIEMPRE tienen prioridad sobre lo guardado en el panel.",
    `DATABASE_PROVIDER=${credentials.provider}`,
    credentials.provider === "supabase" ? `NEXT_PUBLIC_SUPABASE_URL=${credentials.url}` : `NEXT_PUBLIC_INSFORGE_URL=${credentials.url}`,
    credentials.provider === "supabase" ? `NEXT_PUBLIC_SUPABASE_ANON_KEY=${credentials.anonKey}` : `NEXT_PUBLIC_INSFORGE_ANON_KEY=${credentials.anonKey}`,
    credentials.provider === "supabase"
      ? `SUPABASE_SERVICE_ROLE_KEY=${credentials.serviceRoleKey}`
      : `INSFORGE_SERVICE_ROLE_KEY=${credentials.serviceRoleKey}`,
    `ACCESS_LOG_SECRET=${accessLogSecret}`,
  ].join("\n");

  return {
    ok: true,
    message: "Configuracion completada. Tu cuenta de administrador esta lista.",
    envBlock,
    provider: credentials.provider,
    usingEnv: resolved.usingEnv,
  };
}
