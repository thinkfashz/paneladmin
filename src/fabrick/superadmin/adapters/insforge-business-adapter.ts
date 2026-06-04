import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";

import type { Business, CreateBusinessInput, UpdateBusinessInput } from "../types";

export async function getInsforgeBusinessBySlug(slug: string): Promise<Business | null> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return null;
  }

  try {
    const url = new URL(`/rest/v1/businesses`, config.baseUrl);
    url.searchParams.set("select", "*");
    url.searchParams.set("slug", `eq.${slug}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
      },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (err) {
    console.error("Error fetching business by slug from InsForge:", err);
    return null;
  }
}

export async function getInsforgeBusinesses(): Promise<Business[]> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return [];
  }

  try {
    const url = new URL(`/rest/v1/businesses`, config.baseUrl);
    url.searchParams.set("select", "*");

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
    console.error("Error fetching businesses from InsForge:", err);
    return [];
  }
}

export async function createInsforgeBusiness(
  input: CreateBusinessInput,
): Promise<{ ok: boolean; message: string; data?: Business }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/businesses`, config.baseUrl);

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
      return { ok: false, message: `Failed to create business: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Business created successfully", data: data[0] };
  } catch (err) {
    console.error("Error creating business on InsForge:", err);
    return { ok: false, message: "Unknown error creating business" };
  }
}

export async function updateInsforgeBusiness(
  input: UpdateBusinessInput,
): Promise<{ ok: boolean; message: string; data?: Business }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/businesses`, config.baseUrl);
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
      return { ok: false, message: `Failed to update business: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Business updated successfully", data: data[0] };
  } catch (err) {
    console.error("Error updating business on InsForge:", err);
    return { ok: false, message: "Unknown error updating business" };
  }
}
