export type UsersModuleStatus = "base" | "existing" | "demo" | "connected" | "coming-soon" | "needs-work";

export type UsersModuleConfig = {
  id: "users";
  title: string;
  description: string;
  route?: string | null;
  status: UsersModuleStatus;
};
