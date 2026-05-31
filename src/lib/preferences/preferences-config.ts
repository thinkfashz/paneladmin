import type { ColorScheme, ThemePreset } from "./theme";
import type { FontId } from "./fonts";
import type { LayoutId } from "./layout";

export interface UserPreferences {
  colorScheme: ColorScheme;
  themePreset: ThemePreset;
  radius: number;
  font: FontId;
  layout: LayoutId;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  colorScheme: "system",
  themePreset: "default",
  radius: 0.5,
  font: "inter",
  layout: "default",
};

/**
 * Cookie keys used to persist preferences server-side (for SSR hydration)
 * and client-side.
 */
export const COOKIE_KEYS = {
  COLOR_SCHEME: "pref_color_scheme",
  THEME_PRESET: "pref_theme_preset",
  RADIUS: "pref_radius",
  FONT: "pref_font",
  LAYOUT: "pref_layout",
} as const;

/**
 * Local-storage keys (used as a mirror / fallback in some contexts).
 */
export const LS_KEYS = {
  COLOR_SCHEME: "pref:colorScheme",
  THEME_PRESET: "pref:themePreset",
  RADIUS: "pref:radius",
  FONT: "pref:font",
  LAYOUT: "pref:layout",
} as const;

/**
 * Available theme presets (must match the CSS class names in styles/presets/).
 */
export const THEME_PRESETS: { id: ThemePreset; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "tangerine", label: "Tangerine" },
  { id: "brutalist", label: "Brutalist" },
  { id: "soft-pop", label: "Soft Pop" },
];

/**
 * Available border-radius steps (rem).
 */
export const RADIUS_STEPS = [0, 0.25, 0.5, 0.75, 1] as const;

/** Narrow helper type */
export type RadiusStep = (typeof RADIUS_STEPS)[number];
