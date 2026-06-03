import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import { createInsforgeCustomer, getInsforgeCustomers, updateInsforgeCustomer } from "../adapters/insforge-crm-adapter";
import type { CreateCustomerInput, Customer, UpdateCustomerInput } from "../types";

export async function getCustomers(businessId: string): Promise<Customer[]> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return getInsforgeCustomers(businessId);
  }

  return [];
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<{ ok: boolean; message: string; data?: Customer }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return createInsforgeCustomer(input);
  }

  return { ok: false, message: "Provider not supported" };
}

export async function updateCustomer(
  input: UpdateCustomerInput,
): Promise<{ ok: boolean; message: string; data?: Customer }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return updateInsforgeCustomer(input);
  }

  return { ok: false, message: "Provider not supported" };
}
