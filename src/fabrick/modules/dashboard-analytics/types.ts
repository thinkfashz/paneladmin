export type DashboardAnalyticsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardAnalyticsModuleConfig = {
  id: "dashboard-analytics";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardAnalyticsModuleStatus;
};
