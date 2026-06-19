export type DashboardCrmModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardCrmModuleConfig = {
  id: "dashboard-crm";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardCrmModuleStatus;
};
