export type InvoiceModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type InvoiceModuleConfig = {
  id: "invoice";
  title: string;
  description: string;
  route?: string | null;
  status: InvoiceModuleStatus;
};
