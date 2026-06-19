export type PublicTokenPagesModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type PublicTokenPagesModuleConfig = {
  id: "public-token-pages";
  title: string;
  description: string;
  route?: string | null;
  status: PublicTokenPagesModuleStatus;
};
