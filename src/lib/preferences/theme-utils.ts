import type { ColorScheme, ThemePreset } from "./theme";

/**
 * Given a color-scheme preference and the system preference,
 * returns the resolved "light" | "dark" value.
 */
export function resolveColorScheme(
  pref: ColorScheme,
  systemPrefersDark: boolean,
): "light" | "dark" {
  if (pref === "system") return systemPrefersDark ? "dark" : "light";
  return pref;
}

/**
 * Returns the set of HTML class names that should be applied to <html>
 * for the given theme preferences.
 */
export function buildThemeClasses({
  colorScheme,
  themePreset,
  systemPrefersDark,
}: {
  colorScheme: ColorScheme;
  themePreset: ThemePreset;
  systemPrefersDark: boolean;
}): string[] {
  const classes: string[] = [];
  const resolved = resolveColorScheme(colorScheme, systemPrefersDark);
  if (resolved === "dark") classes.push("dark");
  if (themePreset !== "default") classes.push(`theme-${themePreset}`);
  return classes;
}
