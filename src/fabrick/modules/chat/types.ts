export type ChatModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type ChatModuleConfig = {
  id: "chat";
  title: string;
  description: string;
  route?: string | null;
  status: ChatModuleStatus;
};
