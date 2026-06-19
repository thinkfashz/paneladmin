export type GeneratedPagesModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type GeneratedPagesModuleConfig = {
  id: "generated-pages";
  title: string;
  description: string;
  route?: string | null;
  status: GeneratedPagesModuleStatus;
};
