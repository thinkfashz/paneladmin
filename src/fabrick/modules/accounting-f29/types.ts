export type AccountingF29ModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type AccountingF29ModuleConfig = {
  id: "accounting-f29";
  title: string;
  description: string;
  route?: string | null;
  status: AccountingF29ModuleStatus;
};
