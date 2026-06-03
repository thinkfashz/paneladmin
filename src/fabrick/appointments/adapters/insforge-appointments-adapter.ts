import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";

import type { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from "../types";

export async function getInsforgeAppointments(businessId: string): Promise<Appointment[]> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return [];
  }

  try {
    const url = new URL(`/rest/v1/appointments`, config.baseUrl);
    url.searchParams.set("select", "*");
    url.searchParams.set("business_id", `eq.${businessId}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
      },
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching appointments from InsForge:", err);
    return [];
  }
}

export async function createInsforgeAppointment(
  input: CreateAppointmentInput,
): Promise<{ ok: boolean; message: string; data?: Appointment }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/appointments`, config.baseUrl);

    const payload = {
      ...input,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, message: `Failed to create appointment: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Appointment created successfully", data: data[0] };
  } catch (err) {
    console.error("Error creating appointment on InsForge:", err);
    return { ok: false, message: "Unknown error creating appointment" };
  }
}

export async function updateInsforgeAppointment(
  input: UpdateAppointmentInput,
): Promise<{ ok: boolean; message: string; data?: Appointment }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/appointments`, config.baseUrl);
    url.searchParams.set("id", `eq.${input.id}`);

    const payload = {
      ...input,
      id: undefined, // ensure we don't update ID
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return { ok: false, message: `Failed to update appointment: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Appointment updated successfully", data: data[0] };
  } catch (err) {
    console.error("Error updating appointment on InsForge:", err);
    return { ok: false, message: "Unknown error updating appointment" };
  }
}
