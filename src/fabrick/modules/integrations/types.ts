export type IntegrationsModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type IntegrationsModuleConfig = {
  id: "integrations";
  title: string;
  description: string;
  route?: string | null;
  status: IntegrationsModuleStatus;
};
