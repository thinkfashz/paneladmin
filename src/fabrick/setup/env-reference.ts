// Catalogo de todas las variables de entorno y claves que usa el panel.
// Es la fuente de verdad para la pagina /superadmin/system/env y para
// generar la plantilla .env. Solo servidor (lee config-store).

import { maskSecret } from "@/fabrick/security/hash";

import { loadRuntimeConfig } from "./config-store";

export type EnvVariableDefinition = {
  name: string;
  group: string;
  required: boolean;
  secret: boolean;
  description: string;
  howToGet: string;
  example?: string;
};

export const ENV_GROUPS = [
  "Esenciales (Supabase y sesiones)",
  "Asistente de primer inicio",
  "Aplicacion",
  "Seguridad y demos",
  "Solo desarrollo local",
  "Proveedores alternativos (opcional)",
  "Integraciones futuras (opcional)",
] as const;

export const ENV_VARIABLES: EnvVariableDefinition[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    group: "Esenciales (Supabase y sesiones)",
    required: true,
    secret: false,
    description: "URL de tu proyecto Supabase. Es publica (viaja al navegador).",
    howToGet: "Supabase → tu proyecto → Settings → API → Project URL.",
    example: "https://abcdefgh.supabase.co",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    group: "Esenciales (Supabase y sesiones)",
    required: true,
    secret: true,
    description: "Clave publica (anon). Solo permite lo que tus policies RLS dejen pasar.",
    howToGet: "Supabase → Settings → API → Project API keys → anon public.",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    group: "Esenciales (Supabase y sesiones)",
    required: true,
    secret: true,
    description: "Clave maestra del servidor: salta RLS. NUNCA debe llegar al navegador ni al repositorio.",
    howToGet: "Supabase → Settings → API → Project API keys → service_role.",
  },
  {
    name: "ACCESS_LOG_SECRET",
    group: "Esenciales (Supabase y sesiones)",
    required: true,
    secret: true,
    description:
      "Secreto que firma las sesiones de login y el hash de IPs. Si cambia, todas las sesiones se invalidan.",
    howToGet: "Generala tu: openssl rand -hex 48 (o usa la que genero el asistente de setup).",
  },
  {
    name: "FABRICK_CONFIG_KEY",
    group: "Asistente de primer inicio",
    required: false,
    secret: true,
    description:
      "Clave hex de 64 caracteres para cifrar .fabrick/config.enc. Si falta, se genera una en .fabrick/config.key.",
    howToGet: "Generala tu: openssl rand -hex 32.",
  },
  {
    name: "FABRICK_SETUP_FORCE",
    group: "Asistente de primer inicio",
    required: false,
    secret: false,
    description: "Pon true para reabrir el asistente /setup aunque ya este bloqueado con candado.",
    howToGet: "La defines tu manualmente solo cuando necesites reconfigurar.",
    example: "true",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    group: "Aplicacion",
    required: true,
    secret: false,
    description: "URL publica donde corre el panel. Se usa para links absolutos y origenes permitidos.",
    howToGet: "Tu dominio de produccion (o http://localhost:3000 en local).",
    example: "https://mipanel.com",
  },
  {
    name: "DEMO_TOKEN_SECRET",
    group: "Seguridad y demos",
    required: false,
    secret: true,
    description: "Secreto para firmar/hashear los tokens de demos de 72h.",
    howToGet: "Generala tu: openssl rand -hex 48.",
  },
  {
    name: "NEXT_PUBLIC_DEFAULT_DEMO_HOURS",
    group: "Seguridad y demos",
    required: false,
    secret: false,
    description: "Duracion por defecto de las demos en horas.",
    howToGet: "La defines tu.",
    example: "72",
  },
  {
    name: "SECURITY_ALLOWED_ORIGINS",
    group: "Seguridad y demos",
    required: false,
    secret: false,
    description: "Origenes permitidos para requests (separados por coma).",
    howToGet: "Tu(s) dominio(s) de produccion.",
    example: "https://mipanel.com",
  },
  {
    name: "SECURITY_ENABLE_STRICT_CSP",
    group: "Seguridad y demos",
    required: false,
    secret: false,
    description: "Activa una Content-Security-Policy estricta.",
    howToGet: "true o false.",
    example: "false",
  },
  {
    name: "DEV_SUPERADMIN_MODE",
    group: "Solo desarrollo local",
    required: false,
    secret: false,
    description:
      "Permite entrar como dev@fabrick.local sin contrasena. Queda bloqueado automaticamente en produccion; aun asi, NUNCA la pongas en tus secretos de produccion.",
    howToGet: "Solo en tu .env.local de desarrollo.",
    example: "true",
  },
  {
    name: "POCKETBASE_URL",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: false,
    description: "URL de PocketBase si lo usas en lugar de Supabase.",
    howToGet: "Donde tengas alojado PocketBase.",
    example: "http://127.0.0.1:8090",
  },
  {
    name: "POCKETBASE_ADMIN_EMAIL",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: false,
    description: "Email admin de PocketBase.",
    howToGet: "Lo defines al instalar PocketBase.",
  },
  {
    name: "POCKETBASE_ADMIN_PASSWORD",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: true,
    description: "Contrasena admin de PocketBase.",
    howToGet: "La defines al instalar PocketBase.",
  },
  {
    name: "INSFORGE_BASE_URL",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: false,
    description: "URL base de InsForge (proveedor experimental).",
    howToGet: "Panel de InsForge.",
  },
  {
    name: "INSFORGE_ANON_KEY",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: true,
    description: "Clave anonima de InsForge.",
    howToGet: "Panel de InsForge → API keys.",
  },
  {
    name: "INSFORGE_PROJECT_ID",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: false,
    description: "ID del proyecto InsForge.",
    howToGet: "Panel de InsForge.",
  },
  {
    name: "INSFORGE_ACCESS_LOGS_ENDPOINT",
    group: "Proveedores alternativos (opcional)",
    required: false,
    secret: false,
    description: "Endpoint para registros de acceso en InsForge.",
    howToGet: "Panel de InsForge.",
  },
  {
    name: "RESEND_API_KEY",
    group: "Integraciones futuras (opcional)",
    required: false,
    secret: true,
    description: "API key de Resend para enviar emails.",
    howToGet: "resend.com → API Keys.",
  },
  {
    name: "GOOGLE_CLIENT_ID",
    group: "Integraciones futuras (opcional)",
    required: false,
    secret: false,
    description: "OAuth de Google (login social, aun no implementado).",
    howToGet: "Google Cloud Console → Credentials.",
  },
  {
    name: "GOOGLE_CLIENT_SECRET",
    group: "Integraciones futuras (opcional)",
    required: false,
    secret: true,
    description: "Secreto OAuth de Google.",
    howToGet: "Google Cloud Console → Credentials.",
  },
  {
    name: "GITHUB_CLIENT_ID",
    group: "Integraciones futuras (opcional)",
    required: false,
    secret: false,
    description: "OAuth de GitHub (login social, aun no implementado).",
    howToGet: "GitHub → Settings → Developer settings → OAuth Apps.",
  },
  {
    name: "GITHUB_CLIENT_SECRET",
    group: "Integraciones futuras (opcional)",
    required: false,
    secret: true,
    description: "Secreto OAuth de GitHub.",
    howToGet: "GitHub → Settings → Developer settings → OAuth Apps.",
  },
];

export type EnvVariableSource = "env" | "asistente" | "faltante";

export type EnvVariableStatus = EnvVariableDefinition & {
  source: EnvVariableSource;
  displayValue: string | null;
};

// Mapeo de variables que el asistente de setup guarda cifradas en .fabrick/.
const WIZARD_CONFIG_KEYS: Record<
  string,
  "supabaseUrl" | "supabaseAnonKey" | "supabaseServiceRoleKey" | "accessLogSecret"
> = {
  NEXT_PUBLIC_SUPABASE_URL: "supabaseUrl",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "supabaseAnonKey",
  SUPABASE_SERVICE_ROLE_KEY: "supabaseServiceRoleKey",
  ACCESS_LOG_SECRET: "accessLogSecret",
};

export function getEnvVariableStatuses(): EnvVariableStatus[] {
  const stored = loadRuntimeConfig();

  return ENV_VARIABLES.map((variable) => {
    const envValue = process.env[variable.name];
    const wizardKey = WIZARD_CONFIG_KEYS[variable.name];
    const wizardValue = wizardKey && stored ? stored[wizardKey] : undefined;

    let source: EnvVariableSource = "faltante";
    let rawValue: string | undefined;

    if (envValue) {
      source = "env";
      rawValue = envValue;
    } else if (wizardValue) {
      source = "asistente";
      rawValue = wizardValue;
    }

    let displayValue: string | null = null;
    if (rawValue) {
      displayValue = variable.secret ? maskSecret(rawValue) : rawValue;
    }

    return { ...variable, source, displayValue };
  });
}

// Plantilla .env con placeholders (sin valores reales) para copiar a secretos.
export function buildEnvTemplate(): string {
  const lines: string[] = [
    "# Plantilla de variables del panel. Copiala a .env.local o a tus secretos",
    "# de hosting (Vercel → Settings → Environment Variables).",
    "# Los valores reales NUNCA deben subirse al repositorio.",
    "",
  ];

  for (const group of ENV_GROUPS) {
    const vars = ENV_VARIABLES.filter((v) => v.group === group);
    if (vars.length === 0) continue;

    lines.push(`# --- ${group} ---`);
    for (const v of vars) {
      lines.push(`# ${v.description}`);
      lines.push(`${v.name}=${v.example ?? ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
