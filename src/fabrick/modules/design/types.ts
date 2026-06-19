export type DesignModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DesignModuleConfig = {
  id: "design";
  title: string;
  description: string;
  route?: string | null;
  status: DesignModuleStatus;
};
