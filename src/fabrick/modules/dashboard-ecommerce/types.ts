export type DashboardEcommerceModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardEcommerceModuleConfig = {
  id: "dashboard-ecommerce";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardEcommerceModuleStatus;
};
