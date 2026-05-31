export type ColorScheme = "light" | "dark" | "system";

export type ThemePreset =
  | "default"
  | "tangerine"
  | "brutalist"
  | "soft-pop";

export interface ThemePreferences {
  colorScheme: ColorScheme;
  themePreset: ThemePreset;
  radius: number; // rem value, e.g. 0.5
}

export const DEFAULT_THEME: ThemePreferences = {
  colorScheme: "system",
  themePreset: "default",
  radius: 0.5,
};

export const THEME_PRESET_LABELS: Record<ThemePreset, string> = {
  default: "Default",
  tangerine: "Tangerine",
  brutalist: "Brutalist",
  "soft-pop": "Soft Pop",
};

export const RADIUS_OPTIONS = [0, 0.25, 0.5, 0.75, 1] as const;
