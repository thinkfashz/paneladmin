/**
 * Safe wrappers around localStorage.
 * Falls back gracefully when localStorage is unavailable (SSR, private mode).
 */

export function lsGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function lsSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // silently ignore
  }
}

export function lsRemove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // silently ignore
  }
}
