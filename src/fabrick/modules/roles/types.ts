export type RolesModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type RolesModuleConfig = {
  id: "roles";
  title: string;
  description: string;
  route?: string | null;
  status: RolesModuleStatus;
};
