"use client";

import { useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { BrandTheme } from "../types";
import type { UpdateBrandThemeInput } from "../update-brand-theme";

type BrandingFormProps = {
  brand: BrandTheme;
  businessId: string;
  onSave?: (input: UpdateBrandThemeInput) => Promise<{ ok: boolean; message: string }>;
};

export function BrandingForm({ brand, businessId, onSave }: BrandingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: brand.identity.name,
    tagline: brand.identity.tagline ?? "",
    logoUrl: brand.identity.logoUrl ?? "",
    primaryColor: brand.identity.primaryColor,
    secondaryColor: brand.identity.secondaryColor,
    backgroundColor: brand.identity.backgroundColor,
    textColor: brand.identity.textColor,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;

    setIsSubmitting(true);
    try {
      const result = await onSave({
        businessId,
        ...formData,
      });

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (_error) {
      toast.error("Error al guardar los cambios de branding");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Identidad de Marca</CardTitle>
          <CardDescription>Personaliza los colores, el logo y el nombre de tu negocio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del negocio</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Mi Negocio"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Eslogan (opcional)</Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="Ej. El mejor servicio de la ciudad"
              />
            </div>
            <div className="col-span-1 space-y-2 md:col-span-2">
              <Label htmlFor="logoUrl">URL del Logo (opcional)</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Color Primario</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="primaryColor"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="w-12 p-1"
                />
                <Input
                  type="text"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  name="primaryColor"
                  className="uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryColor">Color Secundario</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="secondaryColor"
                  name="secondaryColor"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  className="w-12 p-1"
                />
                <Input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                  name="secondaryColor"
                  className="uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Color de Fondo</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="backgroundColor"
                  name="backgroundColor"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  className="w-12 p-1"
                />
                <Input
                  type="text"
                  value={formData.backgroundColor}
                  onChange={handleChange}
                  name="backgroundColor"
                  className="uppercase"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="textColor">Color de Texto</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="textColor"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleChange}
                  className="w-12 p-1"
                />
                <Input
                  type="text"
                  value={formData.textColor}
                  onChange={handleChange}
                  name="textColor"
                  className="uppercase"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
