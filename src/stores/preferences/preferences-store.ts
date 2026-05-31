import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarVariant = "sidebar" | "floating" | "inset";
type SidebarCollapsible = "offcanvas" | "icon" | "none";
type SidebarMenuVariant = "default" | "transparent";
type SidebarMenuAccent = "default" | "subtle";
type ContentLayout = "compact" | "full";
type ColorScheme =
  | "default"
  | "violet"
  | "rose"
  | "orange"
  | "green"
  | "yellow"
  | "blue";

type SidebarColor =
  | "default"
  | "violet"
  | "rose"
  | "orange"
  | "green"
  | "yellow"
  | "blue"
  | "zinc"
  | "stone"
  | "slate";

interface PreferencesState {
  sidebarVariant: SidebarVariant;
  sidebarCollapsible: SidebarCollapsible;
  sidebarMenuVariant: SidebarMenuVariant;
  sidebarMenuAccent: SidebarMenuAccent;
  contentLayout: ContentLayout;
  colorScheme: ColorScheme;
  sidebarColor: SidebarColor;
  setSidebarVariant: (variant: SidebarVariant) => void;
  setSidebarCollapsible: (collapsible: SidebarCollapsible) => void;
  setSidebarMenuVariant: (variant: SidebarMenuVariant) => void;
  setSidebarMenuAccent: (accent: SidebarMenuAccent) => void;
  setContentLayout: (layout: ContentLayout) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setSidebarColor: (color: SidebarColor) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      sidebarVariant: "sidebar",
      sidebarCollapsible: "icon",
      sidebarMenuVariant: "default",
      sidebarMenuAccent: "subtle",
      contentLayout: "compact",
      colorScheme: "default",
      sidebarColor: "default",
      setSidebarVariant: (variant) => set({ sidebarVariant: variant }),
      setSidebarCollapsible: (collapsible) =>
        set({ sidebarCollapsible: collapsible }),
      setSidebarMenuVariant: (variant) =>
        set({ sidebarMenuVariant: variant }),
      setSidebarMenuAccent: (accent) => set({ sidebarMenuAccent: accent }),
      setContentLayout: (layout) => set({ contentLayout: layout }),
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      setSidebarColor: (color) => set({ sidebarColor: color }),
    }),
    {
      name: "preferences-store",
    }
  )
);
