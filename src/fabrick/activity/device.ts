import type { ActivityDeviceType } from "./types";

export function getActivityDeviceType(userAgent?: string | null): ActivityDeviceType {
  const ua = userAgent?.toLowerCase() ?? "";

  if (!ua) return "unknown";
  if (ua.includes("bot") || ua.includes("crawler") || ua.includes("spider")) return "bot";
  if (ua.includes("tablet") || ua.includes("ipad")) return "tablet";
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) return "mobile";

  return "desktop";
}

export function getActivityBrowserFamily(userAgent?: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";

  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome/")) return "Chrome";
  if (ua.includes("safari/") && !ua.includes("chrome/")) return "Safari";
  if (ua.includes("firefox/")) return "Firefox";

  return "Unknown";
}

export function getActivityOsFamily(userAgent?: string | null) {
  const ua = userAgent?.toLowerCase() ?? "";

  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("linux")) return "Linux";

  return "Unknown";
}
