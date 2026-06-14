export type LandingBuilderModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type LandingBuilderModuleConfig = {
  id: "landing-builder";
  title: string;
  description: string;
  route?: string | null;
  status: LandingBuilderModuleStatus;
};
