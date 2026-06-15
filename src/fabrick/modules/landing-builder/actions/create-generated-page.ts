"use server";

import { revalidatePath } from "next/cache";

import { createGeneratedPage } from "../services/page-engine-service";

export async function createGeneratedPageAction(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const clientName = String(formData.get("clientName") || "").trim();
  const niche = String(formData.get("niche") || "").trim();
  const html = String(formData.get("html") || "").trim();

  if (!title) {
    return {
      ok: false,
      message: "Debes ingresar un título.",
      token: null,
      publicUrl: null,
    };
  }

  if (!html || !html.includes("<html")) {
    return {
      ok: false,
      message: "Debes ingresar un HTML completo que incluya la etiqueta <html>.",
      token: null,
      publicUrl: null,
    };
  }

  const result = await createGeneratedPage({
    title,
    clientName,
    niche,
    html,
  });

  revalidatePath("/admin/landing-builder");
  revalidatePath("/admin/generated-pages");

  return {
    ok: result.ok,
    message: result.message,
    token: result.page?.token ?? null,
    publicUrl: result.page ? `/p/${result.page.token}` : null,
  };
}
