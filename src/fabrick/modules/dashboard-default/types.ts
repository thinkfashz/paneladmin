export type DashboardDefaultModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardDefaultModuleConfig = {
  id: "dashboard-default";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardDefaultModuleStatus;
};
