export type AnalyticsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type AnalyticsModuleConfig = {
  id: "analytics";
  title: string;
  description: string;
  route?: string | null;
  status: AnalyticsModuleStatus;
};
