import { createActivityRecord } from "./create-activity-record";
import { writeActivityToInsForge } from "./adapters/insforge-activity-adapter";
import { writeActivityToPocketBase } from "./adapters/pocketbase-activity-adapter";
import { writeActivityToSupabase } from "./adapters/supabase-activity-adapter";
import { getActivityProvider } from "./provider";
import type { ActivityRecordInput, ActivityWriteResult } from "./types";

export async function writeActivityRecord(input: ActivityRecordInput): Promise<ActivityWriteResult> {
  const record = createActivityRecord(input);
  const provider = getActivityProvider();

  if (provider === "insforge") {
    return writeActivityToInsForge(record);
  }

  if (provider === "supabase") {
    return writeActivityToSupabase(record);
  }

  if (provider === "pocketbase") {
    return writeActivityToPocketBase(record);
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[activity:console]", record);
  }

  return {
    ok: true,
    provider: "console",
    message: "Activity registrada en consola de desarrollo.",
    record,
  };
}
