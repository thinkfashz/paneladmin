"use server";

import { z } from "zod";

import { writeActivityRecord } from "@/fabrick/activity/write-activity-record";
import {
  checkDatabaseTablesExist,
  getAllProviderEnvStatuses,
  getEnvProvider,
  resolveDatabaseCredentials,
  testDatabaseCredentials,
  upsertAdminProfile,
} from "@/fabrick/integrations/database/provider";
import { checkRateLimit } from "@/fabrick/security/rate-limit";

import { canRunSetup, saveRuntimeConfig, writeSetupLock } from "./config-store";
import { REQUIRED_TABLES } from "./migration-sql";
import { randomBytes } from "node:crypto";

const credentialsSchema = z.object({
  provider: z.enum(["supabase", "insforge"]).default("supabase"),
  url: z.string().optional().default(""),
  anonKey: z.string().optional().default(""),
  serviceRoleKey: z.string().optional().default(""),
  supabaseUrl: z.string().optional(),
  supabaseAnonKey: z.string().optional(),
  supabaseServiceRoleKey: z.string().optional(),
  insforgeBaseUrl: z.string().optional(),
  insforgeApiKey: z.string().optional(),
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

  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Credenciales invalidas." };
  }

  const credentials = resolveDatabaseCredentials({
    provider: parsed.data.provider,
    url: parsed.data.url || parsed.data.supabaseUrl || parsed.data.insforgeBaseUrl || "",
    anonKey: parsed.data.anonKey || parsed.data.supabaseAnonKey || "",
    serviceRoleKey:
      parsed.data.serviceRoleKey || parsed.data.supabaseServiceRoleKey || parsed.data.insforgeApiKey || "",
  });
  if (!credentials) return { ok: false, message: "Faltan credenciales para el proveedor seleccionado." };

  return testDatabaseCredentials(credentials);
}


export async function verifyMigrationAction(input: unknown): Promise<SetupActionResult> {
  if (!canRunSetup()) return setupLocked();
  const limited = setupRateLimited();
  if (limited) return limited;

  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Credenciales invalidas." };
  }

  const credentials = resolveDatabaseCredentials({
    provider: parsed.data.provider,
    url: parsed.data.url || parsed.data.supabaseUrl || parsed.data.insforgeBaseUrl || "",
    anonKey: parsed.data.anonKey || parsed.data.supabaseAnonKey || "",
    serviceRoleKey:
      parsed.data.serviceRoleKey || parsed.data.supabaseServiceRoleKey || parsed.data.insforgeApiKey || "",
  });
  if (!credentials) return { ok: false, message: "Faltan credenciales para el proveedor seleccionado." };

  const result = await checkDatabaseTablesExist(credentials, REQUIRED_TABLES);

  if (!result.ok) {
    return {
      ok: false,
      message:
        credentials.provider === "insforge"
          ? "Faltan tablas por crear. Aplica la migracion desde el asistente o desde InsForge."
          : "Faltan tablas por crear. Ejecuta el SQL de migracion en el SQL Editor de Supabase.",
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

  const { adminFullName, adminEmail, adminPassword } = parsed.data;
  const credentials = resolveDatabaseCredentials({
    provider: parsed.data.provider,
    url: parsed.data.url || parsed.data.supabaseUrl || parsed.data.insforgeBaseUrl || "",
    anonKey: parsed.data.anonKey || parsed.data.supabaseAnonKey || "",
    serviceRoleKey:
      parsed.data.serviceRoleKey || parsed.data.supabaseServiceRoleKey || parsed.data.insforgeApiKey || "",
  });
  if (!credentials) return { ok: false, message: "Faltan credenciales para el proveedor seleccionado." };

  const connection = await testDatabaseCredentials(credentials);
  if (!connection.ok) return connection;

  const tables = await checkDatabaseTablesExist(credentials, REQUIRED_TABLES);
  if (!tables.ok) {
    return {
      ok: false,
      message:
        credentials.provider === "insforge"
          ? "La migracion no esta completa. Aplica la migracion en InsForge antes de finalizar."
          : "La migracion no esta completa. Ejecuta el SQL en Supabase antes de finalizar.",
      missingTables: tables.missing,
    };
  }

  // Crea (o conserva) la cuenta superadmin con la contrasena hasheada.
  const { hash } = await import("bcryptjs");
  const passwordHash = await hash(adminPassword, 12);

  const adminProfile = await upsertAdminProfile(credentials, {
    email: adminEmail,
    fullName: adminFullName,
    passwordHash,
  });
  if (!adminProfile.ok) return adminProfile;

  // Secreto de sesion: respeta el del entorno si existe, si no genera uno fuerte.
  const accessLogSecret = process.env.ACCESS_LOG_SECRET || randomBytes(48).toString("hex");

  try {
    saveRuntimeConfig({
      provider: "supabase",
      supabaseUrl: credentials.provider === "supabase" ? credentials.url : "",
      supabaseAnonKey: credentials.provider === "supabase" ? credentials.anonKey : "",
      supabaseServiceRoleKey: credentials.provider === "supabase" ? credentials.serviceRoleKey : "",
      accessLogSecret,
      adminEmail,
      configuredAt: new Date().toISOString(),
    });

    // Candado local: en Vercel puede no persistir, por eso se protege con try/catch.
    writeSetupLock(adminEmail);
  } catch (err) {
    console.error("[setup] No se pudo guardar config local o lock. En Vercel esto puede ser esperado.", err);
  }

  try {
    await writeActivityRecord({
      eventType: "setup_completed",
      path: "/setup",
      method: "POST",
      userEmail: adminEmail,
      metadata: { provider: credentials.provider },
    });
  } catch (err) {
    console.error("[setup] No se pudo registrar actividad de setup_completed.", err);
  }

  const envBlock = [
    "# Configuracion completada.",
    "# Guarda las claves privadas solo en Vercel o .env.local.",
    `DATABASE_PROVIDER=${credentials.provider}`,
    credentials.provider === "supabase"
      ? `NEXT_PUBLIC_SUPABASE_URL=${credentials.url}`
      : `NEXT_PUBLIC_INSFORGE_URL=${credentials.url}`,
    credentials.provider === "supabase"
      ? `NEXT_PUBLIC_SUPABASE_ANON_KEY=${credentials.anonKey}`
      : `NEXT_PUBLIC_INSFORGE_ANON_KEY=${credentials.anonKey}`,
    `ACCESS_LOG_SECRET=${accessLogSecret}`,
  ].join("\n");

  return {
    ok: true,
    message: "Configuracion completada. Tu cuenta de administrador esta lista.",
    envBlock,
  };
}
