import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import { getInsforgeStoreProducts } from "../adapters/insforge-store-adapter";
import type { Product } from "../types";

export async function getPublicStoreProducts(businessId: string): Promise<Product[]> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return getInsforgeStoreProducts(businessId);
  }

  // TODO: Add support for Supabase/Pocketbase fallback adapters later.
  return [];
}
