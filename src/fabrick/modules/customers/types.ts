export type CustomersModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type CustomersModuleConfig = {
  id: "customers";
  title: string;
  description: string;
  route?: string | null;
  status: CustomersModuleStatus;
};
