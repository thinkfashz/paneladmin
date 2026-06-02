import type { ActivityRecord, ActivityWriteResult } from "../types";

export async function writeActivityToPocketBase(record: ActivityRecord): Promise<ActivityWriteResult> {
  const url = process.env.POCKETBASE_URL;

  if (!url) {
    return {
      ok: false,
      provider: "pocketbase",
      message: "PocketBase no esta configurado para activity.",
      record,
    };
  }

  try {
    const response = await fetch(`${url}/api/collections/activity_records/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
      cache: "no-store",
    });

    return {
      ok: response.ok,
      provider: "pocketbase",
      message: response.ok ? "Activity guardada en PocketBase." : `PocketBase respondio con estado ${response.status}.`,
      record,
    };
  } catch (error) {
    return {
      ok: false,
      provider: "pocketbase",
      message: error instanceof Error ? error.message : "Error desconocido guardando activity en PocketBase.",
      record,
    };
  }
}
