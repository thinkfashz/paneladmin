export type DashboardProductivityModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardProductivityModuleConfig = {
  id: "dashboard-productivity";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardProductivityModuleStatus;
};
