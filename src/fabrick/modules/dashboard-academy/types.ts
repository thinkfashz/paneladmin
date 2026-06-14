export type DashboardAcademyModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DashboardAcademyModuleConfig = {
  id: "dashboard-academy";
  title: string;
  description: string;
  route?: string | null;
  status: DashboardAcademyModuleStatus;
};
