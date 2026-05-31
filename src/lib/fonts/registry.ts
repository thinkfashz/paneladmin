export type FontId =
  | "inter"
  | "geist"
  | "manrope"
  | "plus-jakarta-sans"
  | "dm-sans"
  | "ibm-plex-sans";

export interface FontOption {
  id: FontId;
  label: string;
  /** next/font variable name, e.g. "--font-inter" */
  cssVar: string;
  /** Generic stack used as fallback */
  fallback: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "inter",
    label: "Inter",
    cssVar: "--font-inter",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "geist",
    label: "Geist",
    cssVar: "--font-geist",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "manrope",
    label: "Manrope",
    cssVar: "--font-manrope",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    cssVar: "--font-plus-jakarta-sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    cssVar: "--font-dm-sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  {
    id: "ibm-plex-sans",
    label: "IBM Plex Sans",
    cssVar: "--font-ibm-plex-sans",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
];

export const DEFAULT_FONT: FontId = "inter";
