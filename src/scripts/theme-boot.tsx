/**
 * theme-boot.tsx  –  Server Component (no "use client")
 *
 * Drop this in your root layout just before <body> to prevent
 * flash-of-wrong-theme. It reads the persisted cookie and injects
 * a tiny synchronous inline script that applies the correct classes
 * before the browser paints.
 *
 * Usage in app/layout.tsx:
 *   import { ThemeBoot } from "@/scripts/theme-boot";
 *   ...
 *   <html>
 *     <ThemeBoot />
 *     <body>...</body>
 *   </html>
 */

import { cookies } from "next/headers";

import {
  COOKIE_KEYS,
  DEFAULT_PREFERENCES,
} from "@/lib/preferences/preferences-config";

/**
 * Returns the raw value stored in a cookie, or the supplied fallback.
 */
async function readCookie(key: string, fallback: string): Promise<string> {
  const store = await cookies();
  return store.get(key)?.value ?? fallback;
}

export async function ThemeBoot() {
  const colorScheme = await readCookie(
    COOKIE_KEYS.COLOR_SCHEME,
    DEFAULT_PREFERENCES.colorScheme,
  );
  const preset = await readCookie(
    COOKIE_KEYS.THEME_PRESET,
    DEFAULT_PREFERENCES.themePreset,
  );
  const radius = await readCookie(
    COOKIE_KEYS.RADIUS,
    String(DEFAULT_PREFERENCES.radius),
  );
  const font = await readCookie(COOKIE_KEYS.FONT, DEFAULT_PREFERENCES.font);
  const layout = await readCookie(
    COOKIE_KEYS.LAYOUT,
    DEFAULT_PREFERENCES.layout,
  );

  // Build the class-list that would be applied on the <html> element.
  const classes: string[] = [];
  if (colorScheme === "dark") classes.push("dark");
  if (preset && preset !== "default") classes.push(`theme-${preset}`);
  if (font) classes.push(`font-${font}`);
  if (layout) classes.push(`layout-${layout}`);

  // The inline script runs synchronously before any paint.
  const script = `
(function(){
  var cl = document.documentElement.classList;
  // color-scheme
  var scheme = ${JSON.stringify(colorScheme)};
  cl.toggle('dark', scheme === 'dark');
  // preset
  var preset = ${JSON.stringify(preset)};
  cl.forEach(function(c){ if(c.startsWith('theme-')) cl.remove(c); });
  if(preset && preset !== 'default') cl.add('theme-'+preset);
  // radius
  document.documentElement.style.setProperty('--radius', ${JSON.stringify(radius + "rem")});
  // font
  var font = ${JSON.stringify(font)};
  cl.forEach(function(c){ if(c.startsWith('font-')) cl.remove(c); });
  if(font) cl.add('font-'+font);
  // layout
  var layout = ${JSON.stringify(layout)};
  cl.forEach(function(c){ if(c.startsWith('layout-')) cl.remove(c); });
  if(layout) cl.add('layout-'+layout);
})();
`.trim();

  return (
    <>
      {/* Hydration-safe: dangerouslySetInnerHTML is fine in a Server Component */}
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
