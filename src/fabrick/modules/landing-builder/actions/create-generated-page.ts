"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createGeneratedPage } from "../services/page-engine-service";
import { attachLandingToProspect } from "../services/prospects-service";
import type { GeneratedPageContentType } from "../types";

export async function createGeneratedPageAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") || "").trim();
  const clientName = String(formData.get("clientName") || "").trim();
  const niche = String(formData.get("niche") || "").trim();
  const contentType = String(formData.get("contentType") || "html") as GeneratedPageContentType;
  const html = String(formData.get("html") || "").trim();
  const reactCode = String(formData.get("reactCode") || "").trim();
  const css = String(formData.get("css") || "").trim();
  const prospectId = String(formData.get("prospectId") || "").trim();

  if (!title) {
    redirect("/admin/landing-builder?error=missing-title");
  }

  if (contentType === "html" && (!html || !html.includes("<html"))) {
    redirect("/admin/landing-builder?error=invalid-html");
  }

  if (contentType === "react" && (!reactCode || !reactCode.includes("function App"))) {
    redirect("/admin/landing-builder?error=invalid-react");
  }

  const result = await createGeneratedPage({
    title,
    clientName,
    niche,
    html,
    reactCode,
    css,
    contentType,
  });

  if (prospectId && result.page?.token) {
    await attachLandingToProspect({
      prospectId,
      landingToken: result.page.token,
      landingUrl: `/p/${result.page.token}`,
    });
  }

  revalidatePath("/admin/landing-builder");
  revalidatePath("/admin/generated-pages");

  if (!result.ok || !result.page?.token) {
    redirect("/admin/landing-builder?error=create-failed");
  }

  redirect(`/admin/landing-builder?created=${result.page.token}&type=${contentType}`);
}
