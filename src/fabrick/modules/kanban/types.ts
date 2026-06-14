export type KanbanModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type KanbanModuleConfig = {
  id: "kanban";
  title: string;
  description: string;
  route?: string | null;
  status: KanbanModuleStatus;
};
