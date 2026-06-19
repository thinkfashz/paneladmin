"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { importProspects } from "../services/prospects-service";
import type { ImportedProspectInput, ProspectSocialNetworks } from "../types-prospect";

function pickString(source: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }

  return "";
}

function normalizeSocialNetworks(value: unknown): ProspectSocialNetworks {
  if (!value) return {};

  if (typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, String(item)]),
    );
  }

  if (Array.isArray(value)) {
    const entries = value
      .map((item) => {
        if (typeof item === "string") return [item, item] as const;
        if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const name = String(obj.name || obj.platform || obj.red || obj.network || "").trim();
          const url = String(obj.url || obj.link || obj.profile || "").trim();
          if (name || url) return [name || url, url || name] as const;
        }

        return null;
      })
      .filter(Boolean) as Array<readonly [string, string]>;

    return Object.fromEntries(entries);
  }

  return {};
}

function normalizeColorPalette(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeOne(item: unknown): ImportedProspectInput | null {
  if (!item || typeof item !== "object") return null;

  const obj = item as Record<string, unknown>;

  const brandName = pickString(obj, [
    "brandName",
    "brand_name",
    "marca",
    "nombre_marca",
    "nombreMarca",
    "businessName",
    "business_name",
    "name",
    "nombre",
    "empresa",
  ]);

  if (!brandName) return null;

  return {
    brandName,
    projectName: pickString(obj, ["projectName", "project_name", "proyecto", "project", "tipoProyecto"]) || null,
    followers: pickString(obj, ["followers", "seguidores", "socialFollowers", "cantidadSeguidores"]) || null,
    socialNetworks: normalizeSocialNetworks(
      obj.socialNetworks || obj.social_networks || obj.redesSociales || obj.redes || obj.socials,
    ),
    phone: pickString(obj, ["phone", "telefono", "teléfono", "whatsapp", "numero", "número"]) || null,
    email: pickString(obj, ["email", "correo", "correoElectronico", "mail"]) || null,
    website: pickString(obj, ["website", "site", "sitioWeb", "web", "url"]) || null,
    colorPalette: normalizeColorPalette(obj.colorPalette || obj.color_palette || obj.paleta || obj.colors || obj.colores),
    notes: pickString(obj, ["notes", "notas", "descripcion", "descripción", "description", "problema"]) || null,
    source: pickString(obj, ["source", "origen"]) || "json-import",
    raw: obj,
  };
}

export async function importProspectsAction(formData: FormData): Promise<void> {
  const payload = String(formData.get("payload") || "").trim();

  if (!payload) {
    redirect("/admin/landing-builder?error=missing-prospect-json");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(payload);
  } catch {
    redirect("/admin/landing-builder?error=invalid-prospect-json");
  }

  const list = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object"
      ? (
          (parsed as Record<string, unknown>).prospects ||
          (parsed as Record<string, unknown>).prospectos ||
          (parsed as Record<string, unknown>).leads ||
          (parsed as Record<string, unknown>).data ||
          [parsed]
        )
      : [];

  const normalized = Array.isArray(list)
    ? list.map(normalizeOne).filter(Boolean) as ImportedProspectInput[]
    : [];

  const result = await importProspects(normalized);

  revalidatePath("/admin/landing-builder");

  if (!result.ok) {
    redirect("/admin/landing-builder?error=prospect-import-failed");
  }

  redirect(`/admin/landing-builder?imported=${result.count}`);
}
