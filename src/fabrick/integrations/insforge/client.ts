export type InsforgeHealthResult = {
  ok: boolean;
  configured: boolean;
  provider: "insforge";
  message: string;
  checkedAt: string;
};

export function getInsforgeConfig() {
  return {
    baseUrl: process.env.INSFORGE_BASE_URL,
    anonKey: process.env.INSFORGE_ANON_KEY,
    projectId: process.env.INSFORGE_PROJECT_ID,
  };
}

export function isInsforgeConfigured() {
  const config = getInsforgeConfig();
  return Boolean(config.baseUrl && config.anonKey && config.projectId);
}

export async function testInsforgeConnection(): Promise<InsforgeHealthResult> {
  const config = getInsforgeConfig();
  const checkedAt = new Date().toISOString();

  if (!isInsforgeConfigured()) {
    return {
      ok: false,
      configured: false,
      provider: "insforge",
      message: "InsForge no esta configurado. Revisa INSFORGE_BASE_URL, INSFORGE_ANON_KEY e INSFORGE_PROJECT_ID.",
      checkedAt,
    };
  }

  try {
    const response = await fetch(config.baseUrl as string, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId as string,
      },
      cache: "no-store",
    });

    return {
      ok: response.ok,
      configured: true,
      provider: "insforge",
      message: response.ok
        ? "InsForge responde correctamente."
        : `InsForge respondio con estado ${response.status}. Revisa URL, anon key y project id.`,
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
