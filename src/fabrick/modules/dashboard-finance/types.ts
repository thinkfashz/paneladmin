export type DashboardFinanceModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardFinanceModuleConfig = {
  id: "dashboard-finance";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardFinanceModuleStatus;
};
