export type ActivityEventType =
  | "page_view"
  | "login_attempt"
  | "login_success"
  | "login_failed"
  | "login_rate_limited"
  | "logout"
  | "setup_completed"
  | "panel_access"
  | "command_viewed"
  | "action_requested"
  | "action_denied"
  | "action_completed"
  | "provider_error";

export type ActivityDeviceType = "mobile" | "tablet" | "desktop" | "bot" | "unknown";

export type ActivityRecordInput = {
  eventType: ActivityEventType;
  path: string;
  method?: string;
  userId?: string | null;
  userEmail?: string | null;
  businessId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  referer?: string | null;
  metadata?: Record<string, unknown>;
};

export type ActivityRecord = {
  event_type: ActivityEventType;
  path: string;
  method: string;
  user_id?: string | null;
  user_email?: string | null;
  business_id?: string | null;
  ip_hash?: string | null;
  ip_masked?: string | null;
  user_agent?: string | null;
  device_type: ActivityDeviceType;
  browser_family: string;
  os_family: string;
  referer?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type ActivityWriteResult = {
  ok: boolean;
  provider: "insforge" | "supabase" | "pocketbase" | "console" | "none";
  message: string;
  record?: ActivityRecord;
};
