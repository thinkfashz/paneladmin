"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FONTS = ["Inter", "Poppins", "Lato", "Playfair Display", "Roboto"];
const THEMES = [
  { name: "Azul Marino", primary: "#1e40af", accent: "#3b82f6" },
  { name: "Esmeralda", primary: "#065f46", accent: "#10b981" },
  { name: "Violeta", primary: "#5b21b6", accent: "#8b5cf6" },
  { name: "Naranja Vibrante", primary: "#9a3412", accent: "#f97316" },
  { name: "Rosa Moderno", primary: "#9d174d", accent: "#ec4899" },
];

const INITIAL_BRAND = {
  storeName: "Mi Tienda",
  tagline: "Calidad y confianza para tu hogar",
  primaryColor: "#1e40af",
  accentColor: "#3b82f6",
  font: "Inter",
  logoUrl: "",
};

export default function DisenoPage() {
  const [brand, setBrand] = useState(INITIAL_BRAND);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function applyTheme(theme: (typeof THEMES)[number]) {
    setBrand((b) => ({
      ...b,
      primaryColor: theme.primary,
      accentColor: theme.accent,
    }));
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Diseño de Tienda</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Personaliza la apariencia y marca de tu tienda
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Temas */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Temas de color</h2>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => applyTheme(t)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                    brand.primaryColor === t.primary
                      ? "border-primary bg-primary/10 font-semibold"
                      : "hover:border-primary/50 hover:bg-accent"
                  )}
                >
                  <span
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: t.accent }}
                  />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tipografía */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Tipografía</h2>
            <div className="flex flex-wrap gap-2">
              {FONTS.map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setBrand((b) => ({ ...b, font }))}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    brand.font === font
                      ? "border-primary bg-primary/10 font-medium text-primary"
                      : "hover:border-primary/50 hover:bg-accent"
                  )}
                  style={{ fontFamily: font }}
                >
                  {font}
                </button>
              ))}
            </div>
          </div>

          {/* Identidad */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-sm">Identidad de marca</h2>
            <div className="space-y-4">
              {[
                {
                  id: "storeName",
                  label: "Nombre de la tienda",
                  placeholder: "Mi Tienda",
                  key: "storeName" as const,
                },
                {
                  id: "tagline",
                  label: "Slogan / Tagline",
                  placeholder: "Tu mejor opción...",
                  key: "tagline" as const,
                },
                {
                  id: "logoUrl",
                  label: "URL del logo",
                  placeholder: "https://...",
                  key: "logoUrl" as const,
                },
              ].map(({ id, label, placeholder, key }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="mb-1 block text-xs font-medium"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    placeholder={placeholder}
                    value={brand[key]}
                    onChange={(e) =>
                      setBrand((b) => ({ ...b, [key]: e.target.value }))
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    id: "primaryColor",
                    label: "Color primario",
                    key: "primaryColor" as const,
                  },
                  {
                    id: "accentColor",
                    label: "Color acento",
                    key: "accentColor" as const,
                  },
                ].map(({ id, label, key }) => (
                  <div key={id}>
                    <label
                      htmlFor={id}
                      className="mb-1 block text-xs font-medium"
                    >
                      {label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id={id}
                        type="color"
                        value={brand[key]}
                        onChange={(e) =>
                          setBrand((b) => ({ ...b, [key]: e.target.value }))
                        }
                        className="size-9 cursor-pointer rounded border p-0.5"
                      />
                      <span className="font-mono text-xs text-muted-foreground">
                        {brand[key]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-sm">Vista previa</h2>
            <div
              className="rounded-lg border overflow-hidden"
              style={{ fontFamily: brand.font }}
            >
              <div
                className="px-4 py-3 text-white text-sm font-bold"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {brand.storeName || "Mi Tienda"}
              </div>
              <div className="p-4 bg-white dark:bg-gray-900 space-y-2">
                <p className="text-xs text-gray-500">
                  {brand.tagline || "Slogan de tu tienda"}
                </p>
                <button
                  type="button"
                  className="rounded px-3 py-1.5 text-white text-xs"
                  style={{ backgroundColor: brand.accentColor }}
                >
                  Ver productos
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={save}
            className={cn(
              "w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
              saved
                ? "bg-green-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {saved ? "✓ Guardado" : "Guardar cambios"}
          </button>

          <button
            type="button"
            onClick={() => setBrand(INITIAL_BRAND)}
            className="w-full rounded-lg border py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
          >
            Restaurar valores por defecto
          </button>
        </div>
      </div>
    </div>
  );
}
