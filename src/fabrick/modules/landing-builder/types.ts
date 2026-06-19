export type GeneratedPageStatus = "draft" | "published" | "archived";
export type GeneratedPageContentType = "html" | "html-app" | "react";

export type GeneratedPage = {
  id: string;
  token: string;
  title: string;
  clientName: string | null;
  niche: string | null;
  html: string;
  reactCode: string | null;
  css: string | null;
  contentType: GeneratedPageContentType;
  status: GeneratedPageStatus;
  createdAt: string;
  updatedAt: string | null;
};
