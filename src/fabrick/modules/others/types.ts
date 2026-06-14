export type OthersModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type OthersModuleConfig = {
  id: "others";
  title: string;
  description: string;
  route?: string | null;
  status: OthersModuleStatus;
};
