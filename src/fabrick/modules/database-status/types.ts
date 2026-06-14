export type DatabaseStatusModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type DatabaseStatusModuleConfig = {
  id: "database-status";
  title: string;
  description: string;
  route?: string | null;
  status: DatabaseStatusModuleStatus;
};
