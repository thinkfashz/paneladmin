import type { ActivityRecord } from "./types";

export type GetActivityRecordsOptions = {
  businessId?: string;
  limit?: number;
};

export async function getActivityRecords(_options: GetActivityRecordsOptions = {}): Promise<ActivityRecord[]> {
  // TODO: Implementar lectura real desde proveedor activo.
  // Esta funcion queda lista para conectar al panel superadmin.
  return [];
}
