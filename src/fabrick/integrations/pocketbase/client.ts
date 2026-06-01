export type PocketBaseHealthResult = {
  ok: boolean;
  configured: boolean;
  provider: "pocketbase";
  message: string;
  checkedAt: string;
};

export function getPocketBaseConfig() {
  return {
    url: process.env.POCKETBASE_URL,
    adminEmail: process.env.POCKETBASE_ADMIN_EMAIL,
    adminPassword: process.env.POCKETBASE_ADMIN_PASSWORD,
  };
}

export function isPocketBaseConfigured() {
  const config = getPocketBaseConfig();
  return Boolean(config.url);
}

export async function testPocketBaseConnection(): Promise<PocketBaseHealthResult> {
  const config = getPocketBaseConfig();
  const checkedAt = new Date().toISOString();

  if (!isPocketBaseConfigured()) {
    return {
      ok: false,
      configured: false,
      provider: "pocketbase",
      message: "PocketBase no esta configurado. Revisa POCKETBASE_URL.",
      checkedAt,
    };
  }

  try {
    const response = await fetch(`${config.url}/api/health`, {
      method: "GET",
      cache: "no-store",
    });

    return {
      ok: response.ok,
      configured: true,
      provider: "pocketbase",
      message: response.ok
        ? "PocketBase responde correctamente."
        : `PocketBase respondio con estado ${response.status}. Revisa URL y servidor.`,
      checkedAt,
    };
  } catch (error) {
    return {
      ok: false,
      configured: true,
      provider: "pocketbase",
      message: error instanceof Error ? error.message : "Error desconocido conectando PocketBase.",
      checkedAt,
    };
  }
}
