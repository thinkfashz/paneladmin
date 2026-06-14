export type CheckoutModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type CheckoutModuleConfig = {
  id: "checkout";
  title: string;
  description: string;
  route?: string | null;
  status: CheckoutModuleStatus;
};
