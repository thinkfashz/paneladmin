export type LayoutId = "default" | "compact" | "comfortable" | "dense";

export interface LayoutOption {
  id: LayoutId;
  label: string;
  description: string;
}

export const LAYOUT_OPTIONS: LayoutOption[] = [
  {
    id: "default",
    label: "Default",
    description: "Standard spacing and density.",
  },
  {
    id: "compact",
    label: "Compact",
    description: "Reduced padding for data-dense views.",
  },
  {
    id: "comfortable",
    label: "Comfortable",
    description: "Extra breathing room for readability.",
  },
  {
    id: "dense",
    label: "Dense",
    description: "Maximum information density.",
  },
];

export const DEFAULT_LAYOUT: LayoutId = "default";
