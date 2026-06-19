export type EcommerceModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type EcommerceModuleConfig = {
  id: "ecommerce";
  title: string;
  description: string;
  route?: string | null;
  status: EcommerceModuleStatus;
};
