export type PageAnalyticsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type PageAnalyticsModuleConfig = {
  id: "page-analytics";
  title: string;
  description: string;
  route?: string | null;
  status: PageAnalyticsModuleStatus;
};
