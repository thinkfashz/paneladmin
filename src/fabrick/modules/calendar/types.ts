export type CalendarModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type CalendarModuleConfig = {
  id: "calendar";
  title: string;
  description: string;
  route?: string | null;
  status: CalendarModuleStatus;
};
