import { getInsforgeRuntimeConfig } from "@/fabrick/setup/config-store";

export type InsforgeHealthResult = {
  ok: boolean;
  configured: boolean;
  provider: "insforge";
  message: string;
  checkedAt: string;
};

export function getInsforgeConfig() {
  const runtime = getInsforgeRuntimeConfig();

  return {
    baseUrl: runtime?.baseUrl,
    apiKey: runtime?.apiKey,
    // Compatibilidad temporal con adaptadores antiguos.
    anonKey: runtime?.apiKey,
    projectId: process.env.INSFORGE_PROJECT_ID,
  };
}

export function isInsforgeConfigured() {
  const config = getInsforgeConfig();
  return Boolean(config.baseUrl && config.apiKey);
}

export async function testInsforgeConnection(): Promise<InsforgeHealthResult> {
  const config = getInsforgeConfig();
  const checkedAt = new Date().toISOString();

  if (!isInsforgeConfigured()) {
    return {
      ok: false,
      configured: false,
      provider: "insforge",
      message: "InsForge no esta configurado. Revisa INSFORGE_BASE_URL e INSFORGE_API_KEY.",
      checkedAt,
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/database/functions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      cache: "no-store",
    });

    return {
      ok: response.ok,
      configured: true,
      provider: "insforge",
      message: response.ok
        ? "InsForge responde correctamente."
        : `InsForge respondio con estado ${response.status}. Revisa URL y API key.`,
      checkedAt,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      provider: "insforge",
      message: error instanceof Error ? error.message : "Error desconocido conectando InsForge.",
      checkedAt,
    };
  }
}
