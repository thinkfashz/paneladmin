"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createGeneratedPage } from "../services/page-engine-service";
import { attachLandingToProspect } from "../services/prospects-service";
import type { GeneratedPageContentType } from "../types";

async function readSourceFile(formData: FormData) {
  const value = formData.get("sourceFile");

  if (!value || typeof value === "string") return "";

  const maybeFile = value as {
    size?: number;
    text?: () => Promise<string>;
  };

  if (!maybeFile.size || typeof maybeFile.text !== "function") return "";

  return (await maybeFile.text()).trim();
}

export async function createGeneratedPageAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") || "").trim();
  const clientName = String(formData.get("clientName") || "").trim();
  const niche = String(formData.get("niche") || "").trim();
  const contentType = String(formData.get("contentType") || "html") as GeneratedPageContentType;
  const sourceMode = String(formData.get("sourceMode") || "inline");
  let html = String(formData.get("html") || "").trim();
  let reactCode = String(formData.get("reactCode") || "").trim();
  const css = String(formData.get("css") || "").trim();
  const prospectId = String(formData.get("prospectId") || "").trim();

  if (sourceMode === "file") {
    const uploadedSource = await readSourceFile(formData);

    if (uploadedSource) {
      if (contentType === "react") {
        reactCode = uploadedSource;
      } else {
        html = uploadedSource;
      }
    }
  }

  if (!title) {
    redirect("/admin/landing-builder?error=missing-title");
  }

  if ((contentType === "html" || contentType === "html-app") && !html) {
    redirect("/admin/landing-builder?error=invalid-html");
  }

  if (contentType === "react" && !reactCode) {
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
