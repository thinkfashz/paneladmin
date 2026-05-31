"use client";

import { type ReactNode, useEffect } from "react";
import { usePreferencesStore } from "./preferences-store";

interface PreferencesProviderProps {
  children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const {
    colorScheme,
    sidebarColor,
    sidebarMenuVariant,
    sidebarMenuAccent,
  } = usePreferencesStore();

  useEffect(() => {
    const root = document.documentElement;

    // Remove all color scheme classes
    root.classList.remove(
      "scheme-default",
      "scheme-violet",
      "scheme-rose",
      "scheme-orange",
      "scheme-green",
      "scheme-yellow",
      "scheme-blue"
    );

    // Add new color scheme class
    root.classList.add(`scheme-${colorScheme}`);
  }, [colorScheme]);

  useEffect(() => {
    const root = document.documentElement;

    // Remove all sidebar color classes
    root.classList.remove(
      "sidebar-default",
      "sidebar-violet",
      "sidebar-rose",
      "sidebar-orange",
      "sidebar-green",
      "sidebar-yellow",
      "sidebar-blue",
      "sidebar-zinc",
      "sidebar-stone",
      "sidebar-slate"
    );

    // Add new sidebar color class
    root.classList.add(`sidebar-${sidebarColor}`);
  }, [sidebarColor]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("menu-default", "menu-transparent");
    root.classList.add(`menu-${sidebarMenuVariant}`);
  }, [sidebarMenuVariant]);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("accent-default", "accent-subtle");
    root.classList.add(`accent-${sidebarMenuAccent}`);
  }, [sidebarMenuAccent]);

  return <>{children}</>;
}
