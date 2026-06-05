"use client";

import { useState } from "react";

import { Check, Palette, RefreshCw, Type } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const PRESET_COLORS = [
  { name: "Índigo", value: "#6366f1" },
  { name: "Esmeralda", value: "#10b981" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ámbar", value: "#f59e0b" },
  { name: "Cielo", value: "#0ea5e9" },
  { name: "Violeta", value: "#8b5cf6" },
];

const FONT_OPTIONS = ["Inter", "Geist", "Poppins", "Playfair Display", "DM Sans", "Space Grotesk"];

const THEME_OPTIONS = [
  { id: "light", label: "Claro" },
  { id: "dark", label: "Oscuro" },
  { id: "system", label: "Sistema" },
];

interface BrandState {
  storeName: string;
  tagline: string;
  primaryColor: string;
  font: string;
  theme: string;
  footerText: string;
}

export function BrandEditor() {
  const [brand, setBrand] = useState<BrandState>({
    storeName: "",
    tagline: "",
    primaryColor: "#6366f1",
    font: "Inter",
    theme: "light",
    footerText: "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Store identity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Type className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Identidad de la tienda</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="store-name">Nombre del negocio</Label>
            <Input
              id="store-name"
              placeholder="Mi Tienda"
              value={brand.storeName}
              onChange={(e) => setBrand((b) => ({ ...b, storeName: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tagline">Eslogan o descripción corta</Label>
            <Input
              id="tagline"
              placeholder="Tu eslogan aquí"
              value={brand.tagline}
              onChange={(e) => setBrand((b) => ({ ...b, tagline: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <Label htmlFor="footer-text">Texto del pie de página</Label>
            <Input
              id="footer-text"
              placeholder="© 2025 Mi Tienda. Todos los derechos reservados."
              value={brand.footerText}
              onChange={(e) => setBrand((b) => ({ ...b, footerText: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Color palette */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Color principal de marca</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            {PRESET_COLORS.map(({ name, value }) => (
              <button
                key={value}
                title={name}
                onClick={() => setBrand((b) => ({ ...b, primaryColor: value }))}
                className="group relative h-9 w-9 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: value,
                  borderColor: brand.primaryColor === value ? value : "transparent",
                  outline: brand.primaryColor === value ? `2px solid ${value}` : "none",
                  outlineOffset: "2px",
                }}
              >
                {brand.primaryColor === value && (
                  <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor="custom-color" className="shrink-0 text-sm">
              Color personalizado
            </Label>
            <input
              id="custom-color"
              type="color"
              value={brand.primaryColor}
              onChange={(e) => setBrand((b) => ({ ...b, primaryColor: e.target.value }))}
              className="h-9 w-16 cursor-pointer rounded border bg-transparent"
            />
            <span className="font-mono text-muted-foreground text-sm">{brand.primaryColor}</span>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tipografía</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font}
                onClick={() => setBrand((b) => ({ ...b, font }))}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  brand.font === font
                    ? "border-primary bg-primary/10 font-medium text-primary"
                    : "bg-muted/30 hover:border-primary/50"
                }`}
              >
                {font}
              </button>
            ))}
          </div>
          <p className="mt-3 text-muted-foreground text-xs">
            La fuente seleccionada se aplicará en tu tienda pública.
          </p>
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tema visual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {THEME_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setBrand((b) => ({ ...b, theme: id }))}
                className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${
                  brand.theme === id
                    ? "border-primary bg-primary/10 text-primary"
                    : "bg-muted/30 hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Preview */}
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: brand.primaryColor + "40", backgroundColor: brand.primaryColor + "08" }}
      >
        <p className="mb-1 text-muted-foreground text-xs uppercase tracking-wider">Vista previa</p>
        <h2 className="font-bold text-2xl" style={{ color: brand.primaryColor }}>
          {brand.storeName || "Nombre de tu tienda"}
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">{brand.tagline || "Tu eslogan aparece aquí"}</p>
        {brand.footerText && (
          <p className="mt-3 border-t pt-3 text-muted-foreground text-xs">{brand.footerText}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" className="gap-2" onClick={() => setBrand({ storeName: "", tagline: "", primaryColor: "#6366f1", font: "Inter", theme: "light", footerText: "" })}>
          <RefreshCw className="h-4 w-4" />
          Restablecer
        </Button>
        <Button className="gap-2" onClick={handleSave}>
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Guardado
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </div>
    </div>
  );
}
