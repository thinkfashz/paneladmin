export type DashboardLogisticsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardLogisticsModuleConfig = {
  id: "dashboard-logistics";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardLogisticsModuleStatus;
};
