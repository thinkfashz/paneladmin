import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";

import type { Product } from "../types";

export async function getInsforgeStoreProducts(businessId: string): Promise<Product[]> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return [];
  }

  try {
    const url = new URL(`/rest/v1/products`, config.baseUrl);
    url.searchParams.set("select", "*");
    url.searchParams.set("business_id", `eq.${businessId}`);
    url.searchParams.set("is_active", "eq.true");

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
    console.error("Error fetching store products from InsForge:", err);
    return [];
  }
}
