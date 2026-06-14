export type TemplatesModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type TemplatesModuleConfig = {
  id: "templates";
  title: string;
  description: string;
  route?: string | null;
  status: TemplatesModuleStatus;
};
