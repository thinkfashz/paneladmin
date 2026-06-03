import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";

import type { CreateCustomerInput, Customer, UpdateCustomerInput } from "../types";

export async function getInsforgeCustomers(businessId: string): Promise<Customer[]> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return [];
  }

  try {
    const url = new URL(`/rest/v1/customers`, config.baseUrl);
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
    console.error("Error fetching customers from InsForge:", err);
    return [];
  }
}

export async function createInsforgeCustomer(
  input: CreateCustomerInput,
): Promise<{ ok: boolean; message: string; data?: Customer }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/customers`, config.baseUrl);

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
      return { ok: false, message: `Failed to create customer: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Customer created successfully", data: data[0] };
  } catch (err) {
    console.error("Error creating customer on InsForge:", err);
    return { ok: false, message: "Unknown error creating customer" };
  }
}

export async function updateInsforgeCustomer(
  input: UpdateCustomerInput,
): Promise<{ ok: boolean; message: string; data?: Customer }> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/customers`, config.baseUrl);
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
      return { ok: false, message: `Failed to update customer: ${res.statusText}` };
    }

    const data = await res.json();
    return { ok: true, message: "Customer updated successfully", data: data[0] };
  } catch (err) {
    console.error("Error updating customer on InsForge:", err);
    return { ok: false, message: "Unknown error updating customer" };
  }
}
