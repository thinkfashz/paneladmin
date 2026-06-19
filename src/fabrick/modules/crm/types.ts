export type CrmModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type CrmModuleConfig = {
  id: "crm";
  title: string;
  description: string;
  route?: string | null;
  status: CrmModuleStatus;
};
