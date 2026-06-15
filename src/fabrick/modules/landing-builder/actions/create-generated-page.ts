"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createGeneratedPage } from "../services/page-engine-service";

export async function createGeneratedPageAction(formData: FormData): Promise<void> {
  const title = String(formData.get("title") || "").trim();
  const clientName = String(formData.get("clientName") || "").trim();
  const niche = String(formData.get("niche") || "").trim();
  const html = String(formData.get("html") || "").trim();

  if (!title) {
    redirect("/admin/landing-builder?error=missing-title");
  }

  if (!html || !html.includes("<html")) {
    redirect("/admin/landing-builder?error=invalid-html");
  }

  const result = await createGeneratedPage({
    title,
    clientName,
    niche,
    html,
  });

  revalidatePath("/admin/landing-builder");
  revalidatePath("/admin/generated-pages");

  if (!result.ok || !result.page?.token) {
    redirect("/admin/landing-builder?error=create-failed");
  }

  redirect(`/p/${result.page.token}`);
}
