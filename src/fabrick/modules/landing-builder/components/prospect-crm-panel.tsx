"use client";

import { useMemo, useRef, useState } from "react";

import { FileJson, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { importProspectsAction } from "../actions/import-prospects";
import type { CrmProspect } from "../types-prospect";
import { ProspectDetailView } from "./prospect-detail-view";

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
      <aside className="rounded-3xl border bg-background p-4 shadow-sm xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto">
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
              Carga prospectos y toca una card para abrir el detalle operativo.
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
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{prospect.brandName}</p>
                    <p className="line-clamp-2 text-muted-foreground text-xs">
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
      </aside>

      <div>
        {!activeProspect ? (
          <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed text-muted-foreground">
            Selecciona un prospecto
          </div>
        ) : (
          <ProspectDetailView prospect={activeProspect} />
        )}
      </div>
    </section>
  );
}
