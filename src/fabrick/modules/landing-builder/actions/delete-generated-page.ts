"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { deleteGeneratedPageByToken } from "../services/page-engine-service";

export async function deleteGeneratedPageAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") || "").trim();

  if (!token) {
    redirect("/admin/landing-builder?error=missing-delete-token");
  }

  const result = await deleteGeneratedPageByToken(token);

  revalidatePath("/admin/landing-builder");
  revalidatePath("/admin/generated-pages");

  if (!result.ok) {
    redirect("/admin/landing-builder?error=delete-failed");
  }

  redirect("/admin/landing-builder?deleted=1");
}
