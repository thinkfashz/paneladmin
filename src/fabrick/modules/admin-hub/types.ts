export type AdminHubModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type AdminHubModuleConfig = {
  id: "admin-hub";
  title: string;
  description: string;
  route?: string | null;
  status: AdminHubModuleStatus;
};
