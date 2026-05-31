import type { LayoutId } from "./layout";

/**
 * Returns the set of CSS classes to apply on <html> for a given layout ID.
 */
export function buildLayoutClasses(layout: LayoutId): string[] {
  if (layout === "default") return [];
  return [`layout-${layout}`];
}

/**
 * Parses a layout class from the <html> element's class list.
 * Returns "default" if none is found.
 */
export function parseLayoutFromClasses(classList: DOMTokenList): LayoutId {
  for (const cls of Array.from(classList)) {
    if (cls.startsWith("layout-")) {
      return cls.replace("layout-", "") as LayoutId;
    }
  }
  return "default";
}
