export type GeneratedPageStatus = "draft" | "published" | "archived";

export type GeneratedPage = {
  id: string;
  token: string;
  title: string;
  clientName: string | null;
  niche: string | null;
  html: string;
  status: GeneratedPageStatus;
  createdAt: string;
  updatedAt: string | null;
};
