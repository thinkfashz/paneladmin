export type QuotesModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type QuotesModuleConfig = {
  id: "quotes";
  title: string;
  description: string;
  route?: string | null;
  status: QuotesModuleStatus;
};
