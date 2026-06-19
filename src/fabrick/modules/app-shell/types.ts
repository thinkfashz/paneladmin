export type AppShellModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type AppShellModuleConfig = {
  id: "app-shell";
  title: string;
  description: string;
  route?: string | null;
  status: AppShellModuleStatus;
};
