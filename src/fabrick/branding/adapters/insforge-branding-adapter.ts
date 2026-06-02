import { getInsforgeConfig } from "@/fabrick/integrations/insforge/client";

import { defaultBrandTheme } from "../default-brand";
import type { GetBrandThemeOptions } from "../get-brand-theme";
import type { BrandTheme } from "../types";
import type { UpdateBrandThemeInput } from "../update-brand-theme";

export async function getInsforgeBrandTheme(options: GetBrandThemeOptions): Promise<BrandTheme> {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return defaultBrandTheme;
  }

  if (!options.businessId) {
    return defaultBrandTheme;
  }

  try {
    const url = new URL(`/rest/v1/business_settings`, config.baseUrl);
    url.searchParams.set("select", "*");
    url.searchParams.set("business_id", `eq.${options.businessId}`);

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
      },
    });

    if (!res.ok) {
      return defaultBrandTheme;
    }

    const data = await res.json();
    if (!data || data.length === 0) {
      return defaultBrandTheme;
    }

    const settings = data[0];

    return {
      identity: {
        businessId: settings.business_id,
        name: settings.hero_title || defaultBrandTheme.identity.name,
        logoUrl: settings.logo_url || null,
        primaryColor: settings.primary_color || defaultBrandTheme.identity.primaryColor,
        secondaryColor: settings.secondary_color || defaultBrandTheme.identity.secondaryColor,
        backgroundColor: settings.background_color || defaultBrandTheme.identity.backgroundColor,
        textColor: settings.text_color || defaultBrandTheme.identity.textColor,
        tagline: settings.hero_subtitle || defaultBrandTheme.identity.tagline,
      },
      loading: defaultBrandTheme.loading,
    };
  } catch (err) {
    console.error("Error fetching brand theme from InsForge:", err);
    return defaultBrandTheme;
  }
}

export async function updateInsforgeBrandTheme(input: UpdateBrandThemeInput) {
  const config = getInsforgeConfig();
  if (!config.baseUrl || !config.anonKey || !config.projectId) {
    return { ok: false, message: "InsForge config missing" };
  }

  try {
    const url = new URL(`/rest/v1/business_settings`, config.baseUrl);
    url.searchParams.set("business_id", `eq.${input.businessId}`);

    const payload = {
      hero_title: input.name,
      logo_url: input.logoUrl,
      primary_color: input.primaryColor,
      secondary_color: input.secondaryColor,
      background_color: input.backgroundColor,
      text_color: input.textColor,
      hero_subtitle: input.tagline,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.anonKey}`,
        "x-project-id": config.projectId,
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Failed to update brand theme on InsForge", errText);
      return { ok: false, message: `Failed to update: ${res.status}` };
    }

    return { ok: true, message: "Brand theme updated successfully" };
  } catch (err) {
    console.error("Error updating brand theme on InsForge:", err);
    return { ok: false, message: "Unknown error updating theme" };
  }
}
