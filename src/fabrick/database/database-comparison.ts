import { databaseProviders, type DatabaseProviderId } from "./providers";

export type DatabaseCapability = {
  label: string;
  supabase: string;
  pocketbase: string;
  insforge: string;
};

export const databaseCapabilities: DatabaseCapability[] = [
  {
    label: "Uso principal recomendado",
    supabase: "Produccion SaaS",
    pocketbase: "Demos/local/simple",
    insforge: "IA/agentes",
  },
  {
    label: "Auth integrado",
    supabase: "Si",
    pocketbase: "Si",
    insforge: "Depende de la configuracion",
  },
  {
    label: "Base relacional fuerte",
    supabase: "Si, Postgres",
    pocketbase: "SQLite embebido",
    insforge: "Orientado a backend agent-native",
  },
  {
    label: "Storage de archivos",
    supabase: "Si",
    pocketbase: "Si",
    insforge: "Depende del stack",
  },
  {
    label: "Multi-negocio / multi-tenant",
    supabase: "Muy recomendado",
    pocketbase: "Posible, requiere cuidado",
    insforge: "Experimental para este caso",
  },
  {
    label: "Demos 72h seguras",
    supabase: "Muy recomendado",
    pocketbase: "Posible",
    insforge: "Posible como integracion",
  },
  {
    label: "Facilidad inicial",
    supabase: "Media",
    pocketbase: "Alta",
    insforge: "Media/experimental",
  },
  {
    label: "Escalabilidad comercial",
    supabase: "Alta",
    pocketbase: "Media",
    insforge: "Por validar",
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
  primary: "supabase" as DatabaseProviderId,
  secondary: "pocketbase" as DatabaseProviderId,
  experimental: "insforge" as DatabaseProviderId,
  message:
    "Para la primera version vendible usa Supabase como base principal. PocketBase puede servir para demos locales o instalaciones simples. InsForge dejalo como modulo futuro para IA/agentes.",
};
