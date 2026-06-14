// Almacen de configuracion runtime del panel (solo servidor).
// Guarda credenciales ingresadas en el asistente de primer inicio,
// cifradas con AES-256-GCM en .fabrick/config.enc. Las variables de
// entorno reales SIEMPRE tienen prioridad sobre lo guardado aqui.

import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export type RuntimeConfig = {
  provider: "supabase";
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  accessLogSecret: string;
  adminEmail: string;
  configuredAt: string;
};

const CONFIG_DIR = path.join(process.cwd(), ".fabrick");
const CONFIG_FILE = path.join(CONFIG_DIR, "config.enc");
const KEY_FILE = path.join(CONFIG_DIR, "config.key");
const LOCK_FILE = path.join(CONFIG_DIR, "setup.lock");

type ConfigCache = { value: RuntimeConfig | null; loaded: boolean };

// Cache global para no leer/descifrar el archivo en cada request.
const globalCache = globalThis as typeof globalThis & { __fabrickConfigCache?: ConfigCache };

function getCache(): ConfigCache {
  if (!globalCache.__fabrickConfigCache) {
    globalCache.__fabrickConfigCache = { value: null, loaded: false };
  }
  return globalCache.__fabrickConfigCache;
}

function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
}

function getEncryptionKey(): Buffer {
  const fromEnv = process.env.FABRICK_CONFIG_KEY;
  if (fromEnv && /^[0-9a-fA-F]{64}$/.test(fromEnv)) {
    return Buffer.from(fromEnv, "hex");
  }

  if (existsSync(KEY_FILE)) {
    const stored = readFileSync(KEY_FILE, "utf8").trim();
    if (/^[0-9a-fA-F]{64}$/.test(stored)) {
      return Buffer.from(stored, "hex");
    }
  }

  ensureConfigDir();
  const key = randomBytes(32);
  writeFileSync(KEY_FILE, key.toString("hex"), { mode: 0o600 });
  chmodSync(KEY_FILE, 0o600);
  return key;
}

export function saveRuntimeConfig(config: RuntimeConfig) {
  ensureConfigDir();

  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(config), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload = JSON.stringify({
    v: 1,
    iv: iv.toString("base64"),
    tag: authTag.toString("base64"),
    data: encrypted.toString("base64"),
  });

  writeFileSync(CONFIG_FILE, payload, { mode: 0o600 });
  chmodSync(CONFIG_FILE, 0o600);

  const cache = getCache();
  cache.value = config;
  cache.loaded = true;
}

export function loadRuntimeConfig(): RuntimeConfig | null {
  const cache = getCache();
  if (cache.loaded) return cache.value;

  cache.loaded = true;
  cache.value = null;

  try {
    if (!existsSync(CONFIG_FILE)) return null;

    const payload = JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
    const key = getEncryptionKey();
    const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "base64"));
    decipher.setAuthTag(Buffer.from(payload.tag, "base64"));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(payload.data, "base64")), decipher.final()]);

    cache.value = JSON.parse(decrypted.toString("utf8")) as RuntimeConfig;
  } catch (err) {
    console.error("[fabrick:setup] No se pudo leer la configuracion guardada.", err);
    cache.value = null;
  }

  return cache.value;
}

export function writeSetupLock(adminEmail: string) {
  ensureConfigDir();
  writeFileSync(LOCK_FILE, JSON.stringify({ completedAt: new Date().toISOString(), adminEmail }, null, 2), {
    mode: 0o600,
  });
}

export function hasSetupLock(): boolean {
  return existsSync(LOCK_FILE);
}

// Si el usuario ya configuro todo via variables de entorno (sus "secretos"),
// el asistente no es necesario: se considera la app como configurada.
export function hasFullEnvConfig(): boolean {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY &&
      process.env.ACCESS_LOG_SECRET,
  );

  const hasInsForgeEnv = Boolean(
    (process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL || process.env.INSFORGE_BASE_URL) &&
      (process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || process.env.INSFORGE_ANON_KEY) &&
      (process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY) &&
      process.env.ACCESS_LOG_SECRET,
  );

  return hasSupabaseEnv || hasInsForgeEnv;
}

export function isSetupComplete(): boolean {
  return hasSetupLock() || hasFullEnvConfig();
}

// Candado: el asistente solo corre si nunca se completo, o si el dueno
// lo fuerza explicitamente con FABRICK_SETUP_FORCE=true en su entorno.
export function canRunSetup(): boolean {
  if (process.env.FABRICK_SETUP_FORCE === "true") return true;
  return !isSetupComplete();
}

export type SupabaseRuntimeConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey: string;
};

export function getSupabaseRuntimeConfig(): SupabaseRuntimeConfig | null {
  const stored = loadRuntimeConfig();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || stored?.supabaseUrl;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || stored?.supabaseAnonKey;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || stored?.supabaseServiceRoleKey;

  if (!url || !anonKey || !serviceRoleKey) return null;
  return { url, anonKey, serviceRoleKey };
}

// Secreto para firmar sesiones. En produccion NUNCA cae a un valor debil:
// si no hay secreto configurado, devuelve null y el login debe fallar.
export function getSessionSecret(): string | null {
  const fromEnv = process.env.ACCESS_LOG_SECRET;
  if (fromEnv) return fromEnv;

  const stored = loadRuntimeConfig();
  if (stored?.accessLogSecret) return stored.accessLogSecret;

  if (process.env.NODE_ENV !== "production") return "dev_secret_only_for_local_development";
  return null;
}
