export type EmailModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type EmailModuleConfig = {
  id: "email";
  title: string;
  description: string;
  route?: string | null;
  status: EmailModuleStatus;
};
