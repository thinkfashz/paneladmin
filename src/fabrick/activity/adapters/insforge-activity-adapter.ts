import { getInsforgeRuntimeConfig } from "@/fabrick/setup/config-store";

import type { ActivityRecord, ActivityWriteResult } from "../types";

export async function writeActivityToInsForge(record: ActivityRecord): Promise<ActivityWriteResult> {
  const config = getInsforgeRuntimeConfig();

  if (!config) {
    return {
      ok: false,
      provider: "insforge",
      message: "InsForge no esta configurado para activity.",
      record,
    };
  }

  try {
    const response = await fetch(`${config.baseUrl}/api/database/records/activity_records`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        {
          event_type: record.event_type,
          path: record.path,
          method: record.method,
          user_id: record.user_id,
          user_email: record.user_email,
          business_id: record.business_id,
          ip_hash: record.ip_hash,
          ip_masked: record.ip_masked,
          user_agent: record.user_agent,
          device_type: record.device_type,
          browser_family: record.browser_family,
          os_family: record.os_family,
          referer: record.referer,
          metadata: record.metadata ?? {},
        },
      ]),
      cache: "no-store",
    });

    return {
      ok: response.ok,
      provider: "insforge",
      message: response.ok ? "Activity guardada en InsForge." : `InsForge respondio con estado ${response.status}.`,
      record,
    };
  } catch (error) {
    return {
      ok: false,
      provider: "insforge",
      message: error instanceof Error ? error.message : "Error desconocido guardando activity en InsForge.",
      record,
    };
  }
}
