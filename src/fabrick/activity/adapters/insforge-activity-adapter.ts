import type { ActivityRecord, ActivityWriteResult } from "../types";

export async function writeActivityToInsForge(record: ActivityRecord): Promise<ActivityWriteResult> {
  const baseUrl = process.env.INSFORGE_BASE_URL;
  const anonKey = process.env.INSFORGE_ANON_KEY;
  const projectId = process.env.INSFORGE_PROJECT_ID;

  if (!baseUrl || !anonKey || !projectId) {
    return {
      ok: false,
      provider: "insforge",
      message: "InsForge no esta configurado para activity.",
      record,
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[activity:insforge:prepared]", record);
  }

  return {
    ok: true,
    provider: "insforge",
    message: "Activity preparada para InsForge. Conectar endpoint real cuando exista la coleccion.",
    record,
  };
}
