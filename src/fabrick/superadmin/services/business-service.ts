import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import {
  createInsforgeBusiness,
  getInsforgeBusinesses,
  updateInsforgeBusiness,
} from "../adapters/insforge-business-adapter";
import type { Business, CreateBusinessInput, UpdateBusinessInput } from "../types";

export async function getBusinesses(): Promise<Business[]> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return getInsforgeBusinesses();
  }

  return [];
}

export async function createBusiness(
  input: CreateBusinessInput,
): Promise<{ ok: boolean; message: string; data?: Business }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return createInsforgeBusiness(input);
  }

  return { ok: false, message: "Provider not supported" };
}

export async function updateBusiness(
  input: UpdateBusinessInput,
): Promise<{ ok: boolean; message: string; data?: Business }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return updateInsforgeBusiness(input);
  }

  return { ok: false, message: "Provider not supported" };
}
