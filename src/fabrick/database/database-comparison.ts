import { databaseProviders, type DatabaseProviderId } from "./providers";

export type DatabaseCapability = {
  label: string;
  supabase: string;
  pocketbase: string;
  insforge: string;
};

export const databaseCapabilities: DatabaseCapability[] = [
  {
    label: "Rol dentro de Fabrick Admin",
    supabase: "Base SaaS tradicional opcional",
    pocketbase: "Demos/local/simple",
    insforge: "Backend activo del proyecto",
  },
  {
    label: "Uso principal recomendado",
    supabase: "Produccion SaaS con Postgres",
    pocketbase: "Prototipos o instalacion ligera",
    insforge: "Backend principal + IA/agentes",
  },
  {
    label: "Auth integrado",
    supabase: "Si",
    pocketbase: "Si",
    insforge: "Segun configuracion del proyecto",
  },
  {
    label: "Base relacional fuerte",
    supabase: "Si, Postgres",
    pocketbase: "SQLite embebido",
    insforge: "Backend gestionado orientado a agentes",
  },
  {
    label: "Storage de archivos",
    supabase: "Si",
    pocketbase: "Si",
    insforge: "Segun configuracion",
  },
  {
    label: "Multi-negocio / multi-tenant",
    supabase: "Muy fuerte con RLS",
    pocketbase: "Posible, requiere reglas manuales",
    insforge: "Debe modelarse por business_id",
  },
  {
    label: "Demos 72h seguras",
    supabase: "Muy recomendado",
    pocketbase: "Posible",
    insforge: "Recomendado si sera backend activo",
  },
  {
    label: "Facilidad inicial",
    supabase: "Media",
    pocketbase: "Alta",
    insforge: "Media",
  },
  {
    label: "Escalabilidad comercial",
    supabase: "Alta",
    pocketbase: "Media",
    insforge: "Por validar con uso real",
  },
];

export type ProviderEnvStatus = {
  id: DatabaseProviderId;
  name: string;
  configured: boolean;
  missingKeys: string[];
  presentKeys: string[];
};

export function getProviderEnvStatus(env: NodeJS.ProcessEnv): ProviderEnvStatus[] {
  return databaseProviders.map((provider) => {
    const presentKeys = provider.envKeys.filter((key) => Boolean(env[key]));
    const missingKeys = provider.envKeys.filter((key) => !env[key]);

    return {
      id: provider.id,
      name: provider.name,
      configured: missingKeys.length === 0,
      missingKeys,
      presentKeys,
    };
  });
}

export const databaseRecommendation = {
  primary: "insforge" as DatabaseProviderId,
  secondary: "supabase" as DatabaseProviderId,
  local: "pocketbase" as DatabaseProviderId,
  message:
    "InsForge queda como backend activo del proyecto. Supabase queda como alternativa fuerte para Postgres/Auth/Storage y PocketBase como opcion liviana para demos locales o instalaciones simples.",
};
