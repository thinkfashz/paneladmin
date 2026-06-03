import { getActiveDatabaseProvider } from "@/fabrick/database/get-active-provider";

import {
  createInsforgeAppointment,
  getInsforgeAppointments,
  updateInsforgeAppointment,
} from "../adapters/insforge-appointments-adapter";
import type { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from "../types";

export async function getAppointments(businessId: string): Promise<Appointment[]> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return getInsforgeAppointments(businessId);
  }

  return [];
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<{ ok: boolean; message: string; data?: Appointment }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return createInsforgeAppointment(input);
  }

  return { ok: false, message: "Provider not supported" };
}

export async function updateAppointment(
  input: UpdateAppointmentInput,
): Promise<{ ok: boolean; message: string; data?: Appointment }> {
  const provider = getActiveDatabaseProvider();

  if (provider === "insforge") {
    return updateInsforgeAppointment(input);
  }

  return { ok: false, message: "Provider not supported" };
}
