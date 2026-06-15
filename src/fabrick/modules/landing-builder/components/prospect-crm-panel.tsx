"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

import {
  ExternalLink,
  FileJson,
  Globe,
  Mail,
  Palette,
  Phone,
  Rocket,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { importProspectsAction } from "../actions/import-prospects";
import type { CrmProspect } from "../types-prospect";

export function ProspectCrmPanel({
  prospects,
  selectedProspectId,
}: {
  prospects: CrmProspect[];
  selectedProspectId?: string | null;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [payload, setPayload] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(
    selectedProspectId || prospects[0]?.id || null,
  );

  const activeProspect = useMemo(
    () => prospects.find((item) => item.id === activeId) || prospects[0] || null,
    [prospects, activeId],
  );

  async function handleJsonImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isJson =
      file.type === "application/json" ||
      file.name.toLowerCase().endsWith(".json");

    if (!isJson) {
      alert("Selecciona un archivo .json válido");
      event.target.value = "";
      return;
    }

    const content = await file.text();

    try {
      JSON.parse(content);
    } catch {
      alert("El archivo no tiene JSON válido");
      event.target.value = "";
      return;
    }

    setPayload(content);
    setFileName(file.name);
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="rounded-3xl border bg-background p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              CRM Prospectos
            </p>
            <h2 className="mt-1 flex items-center gap-2 font-bold text-xl">
              <Users className="size-5" />
              Importar JSON
            </h2>
            <p className="mt-2 text-muted-foreground text-sm">
              Carga prospectos y selecciónalos para crear una landing con sus datos.
            </p>
          </div>

          <Badge variant="outline">{prospects.length} leads</Badge>
        </div>

        <form action={importProspectsAction} className="mt-4 space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleJsonImport}
          />

          <input type="hidden" name="payload" value={payload} />

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileJson className="size-4" />
              Importar JSON
            </Button>

            <Button type="submit" disabled={!payload} className="gap-2">
              <Sparkles className="size-4" />
              Guardar prospectos
            </Button>
          </div>

          {fileName && (
            <div className="rounded-2xl border bg-muted/40 p-3 text-sm">
              Archivo listo: <span className="font-medium">{fileName}</span>
            </div>
          )}
        </form>

        <div className="mt-5 space-y-2">
          {prospects.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-5 text-muted-foreground text-sm">
              Todavía no hay prospectos. Importa un JSON para empezar.
            </div>
          ) : (
            prospects.map((prospect) => (
              <button
                key={prospect.id}
                type="button"
                onClick={() => setActiveId(prospect.id)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                  activeProspect?.id === prospect.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{prospect.brandName}</p>
                    <p className="text-muted-foreground text-xs">
                      {prospect.projectName || "Proyecto sin nombre"} ·{" "}
                      {prospect.followers || "Sin seguidores"}
                    </p>
                  </div>

                  {prospect.landingToken ? (
                    <Badge variant="secondary">Landing</Badge>
                  ) : (
                    <Badge variant="outline">Nuevo</Badge>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,.16),transparent_36%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))] p-5 shadow-sm">
        {!activeProspect ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-dashed text-muted-foreground">
            Selecciona un prospecto
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  Prospecto seleccionado
                </p>
                <h3 className="mt-2 font-black text-3xl tracking-tight md:text-4xl">
                  {activeProspect.brandName}
                </h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {activeProspect.notes ||
                    "Sin descripción todavía. Puedes crear una demo y guardar el link en este prospecto."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/landing-builder?prospect=${activeProspect.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground text-sm"
                >
                  <Rocket className="size-4" />
                  Crear página
                </Link>

                {activeProspect.landingUrl && (
                  <Link
                    href={activeProspect.landingUrl}
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 font-medium text-sm"
                  >
                    <ExternalLink className="size-4" />
                    Ver landing
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <InfoBox
                icon={<Users className="size-4" />}
                label="Seguidores"
                value={activeProspect.followers || "Sin dato"}
              />
              <InfoBox
                icon={<Phone className="size-4" />}
                label="Número"
                value={activeProspect.phone || "Sin dato"}
              />
              <InfoBox
                icon={<Mail className="size-4" />}
                label="Correo"
                value={activeProspect.email || "Sin dato"}
              />
              <InfoBox
                icon={<Globe className="size-4" />}
                label="Sitio web"
                value={activeProspect.website || "Sin dato"}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border bg-background/70 p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Share2 className="size-4" />
                  Redes sociales
                </h4>

                <div className="mt-3 space-y-2">
                  {Object.entries(activeProspect.socialNetworks).length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Sin redes registradas.
                    </p>
                  ) : (
                    Object.entries(activeProspect.socialNetworks).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between gap-3 rounded-xl border p-3 text-sm"
                      >
                        <span className="font-medium capitalize">{key}</span>
                        <span className="truncate text-muted-foreground">{value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-2xl border bg-background/70 p-4">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Palette className="size-4" />
                  Paleta de colores
                </h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {activeProspect.colorPalette.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      Sin paleta registrada.
                    </p>
                  ) : (
                    activeProspect.colorPalette.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2 text-sm"
                      >
                        <span
                          className="size-5 rounded-full border"
                          style={{ background: color }}
                        />
                        <span className="font-mono">{color}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {activeProspect.landingToken && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold">Landing guardada en CRM</p>
                <p className="mt-1 text-muted-foreground text-sm">
                  Token: <span className="font-mono">{activeProspect.landingToken}</span>
                </p>
                <p className="text-muted-foreground text-sm">
                  Link: <span className="font-mono">{activeProspect.landingUrl}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <p className="mt-2 truncate font-semibold">{value}</p>
    </div>
  );
}
