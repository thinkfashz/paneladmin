import { getActivityBrowserFamily, getActivityDeviceType, getActivityOsFamily } from "./device";
import { hashActivityIp, maskActivityIp } from "./ip";
import type { ActivityRecord, ActivityRecordInput } from "./types";

export async function createActivityRecord(input: ActivityRecordInput): Promise<ActivityRecord> {
  const ip_hash = await hashActivityIp(input.ip);
  return {
    event_type: input.eventType,
    path: input.path,
    method: input.method ?? "GET",
    user_id: input.userId ?? null,
    user_email: input.userEmail ?? null,
    business_id: input.businessId ?? null,
    ip_hash,
    ip_masked: maskActivityIp(input.ip),
    user_agent: input.userAgent ?? null,
    device_type: getActivityDeviceType(input.userAgent),
    browser_family: getActivityBrowserFamily(input.userAgent),
    os_family: getActivityOsFamily(input.userAgent),
    referer: input.referer ?? null,
    metadata: input.metadata ?? {},
    created_at: new Date().toISOString(),
  };
}
