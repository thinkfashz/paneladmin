export type BusinessSettingsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type BusinessSettingsModuleConfig = {
  id: "business-settings";
  title: string;
  description: string;
  route?: string | null;
  status: BusinessSettingsModuleStatus;
};
