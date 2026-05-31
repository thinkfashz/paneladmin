import { getCookie, setCookie } from "../cookie.client";
import { COOKIE_KEYS } from "./preferences-config";
import type { UserPreferences } from "./preferences-config";

/**
 * Read all preferences from cookies (client-side).
 * Missing keys fall back to the defaults in preferences-config.
 */
export function readPreferences(
  defaults: UserPreferences,
): UserPreferences {
  return {
    colorScheme:
      (getCookie(COOKIE_KEYS.COLOR_SCHEME) as UserPreferences["colorScheme"]) ??
      defaults.colorScheme,
    themePreset:
      (getCookie(COOKIE_KEYS.THEME_PRESET) as UserPreferences["themePreset"]) ??
      defaults.themePreset,
    radius: Number(getCookie(COOKIE_KEYS.RADIUS) ?? defaults.radius),
    font:
      (getCookie(COOKIE_KEYS.FONT) as UserPreferences["font"]) ?? defaults.font,
    layout:
      (getCookie(COOKIE_KEYS.LAYOUT) as UserPreferences["layout"]) ??
      defaults.layout,
  };
}

/**
 * Persist a single preference key to a cookie.
 */
export function writePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K],
): void {
  const cookieKey = COOKIE_KEYS[key.toUpperCase() as keyof typeof COOKIE_KEYS];
  if (cookieKey) setCookie(cookieKey, String(value));
}
