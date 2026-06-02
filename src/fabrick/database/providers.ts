export type DatabaseProviderId = "supabase" | "pocketbase" | "insforge";

export type DatabaseProviderStatus = "recommended" | "supported" | "experimental";

export type DatabaseProvider = {
  id: DatabaseProviderId;
  name: string;
  status: DatabaseProviderStatus;
  purpose: string;
  docsUrl: string;
  setupUrl: string;
  envKeys: string[];
  strengths: string[];
  risks: string[];
  bestFor: string[];
};

export const databaseProviders: DatabaseProvider[] = [
  {
    id: "supabase",
    name: "Supabase",
    status: "recommended",
    purpose: "Base principal recomendada para produccion SaaS.",
    docsUrl: "https://supabase.com/docs",
    setupUrl: "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs",
    envKeys: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"],
    strengths: [
      "Postgres real",
      "Auth integrado",
      "Storage para logos e imagenes",
      "Row Level Security",
      "Buen soporte para Next.js",
      "Escalable para multi-negocio",
    ],
    risks: [
      "Debe configurarse RLS correctamente",
      "La service role key nunca debe exponerse al navegador",
      "Requiere entender permisos por negocio",
    ],
    bestFor: ["Produccion", "SaaS multi-cliente", "Demos 72h seguras", "CRM y agenda", "Tienda publica"],
  },
  {
    id: "pocketbase",
    name: "PocketBase",
    status: "supported",
    purpose: "Base liviana para demos locales, pruebas o instalaciones simples.",
    docsUrl: "https://pocketbase.io/docs/",
    setupUrl: "https://pocketbase.io/docs/going-to-production/",
    envKeys: ["POCKETBASE_URL", "POCKETBASE_ADMIN_EMAIL", "POCKETBASE_ADMIN_PASSWORD"],
    strengths: ["Muy liviano", "Portable", "Rapido de levantar", "Ideal para pruebas locales", "Admin incluido"],
    risks: [
      "Menos ideal para un SaaS grande multi-tenant",
      "Backups y despliegue dependen del servidor",
      "Hay que cuidar reglas de colecciones manualmente",
    ],
    bestFor: ["Demos rapidas", "Prototipos", "Instalaciones simples", "Clientes pequenos con servidor propio"],
  },
  {
    id: "insforge",
    name: "InsForge",
    status: "experimental",
    purpose: "Backend orientado a agentes e IA para flujos mas automatizados.",
    docsUrl: "https://docs.insforge.dev/introduction",
    setupUrl: "https://docs.insforge.dev/examples/framework-guides/nextjs",
    envKeys: ["INSFORGE_BASE_URL", "INSFORGE_ANON_KEY", "INSFORGE_PROJECT_ID"],
    strengths: [
      "Enfoque agent-native",
      "Interesante para automatizaciones con IA",
      "Puede servir para modulos futuros de agentes",
    ],
    risks: [
      "Menos probado para negocios tradicionales",
      "Conviene usarlo como integracion, no como base principal inicial",
      "Hay que validar bien seguridad y limites",
    ],
    bestFor: ["IA", "Agentes", "Automatizaciones", "Scrapers futuros", "Backends experimentales"],
  },
];

export function getDatabaseProvider(id: DatabaseProviderId) {
  return databaseProviders.find((provider) => provider.id === id);
}
