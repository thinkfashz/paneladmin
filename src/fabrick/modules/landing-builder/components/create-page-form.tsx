"use client";

import { useMemo, useRef, useState } from "react";

import { Code2, Eye, FileUp, Rocket, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createGeneratedPageAction } from "../actions/create-generated-page";
import { demoLandingHtml } from "../data";
import { ContainerScroll } from "./container-scroll";

export function CreateGeneratedPageForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [html, setHtml] = useState(demoLandingHtml);
  const [fileName, setFileName] = useState<string | null>(null);

  const previewHtml = useMemo(() => {
    if (!html.trim()) {
      return `
        <!doctype html>
        <html>
          <body style="font-family: system-ui; padding: 24px;">
            <h1>Sin HTML cargado</h1>
            <p>Importa un archivo .html o escribe el código para ver el preview.</p>
          </body>
        </html>
      `;
    }

    return html;
  }, [html]);

  async function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isHtml =
      file.type === "text/html" ||
      file.name.toLowerCase().endsWith(".html") ||
      file.name.toLowerCase().endsWith(".htm");

    if (!isHtml) {
      alert("Selecciona un archivo .html o .htm");
      event.target.value = "";
      return;
    }

    const content = await file.text();
    setHtml(content);
    setFileName(file.name);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
      <form action={createGeneratedPageAction} className="space-y-4 rounded-2xl border bg-background p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="size-5" />
            <div>
              <h2 className="font-semibold text-lg">Crear página HTML</h2>
              <p className="text-muted-foreground text-sm">
                Escribe, pega o importa un archivo HTML completo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,text/html"
              className="hidden"
              onChange={handleFileImport}
            />

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="size-4" />
              Importar HTML
            </Button>
          </div>
        </div>

        {fileName && (
          <div className="rounded-xl border bg-muted/40 px-3 py-2 text-muted-foreground text-sm">
            Archivo importado: <span className="font-medium text-foreground">{fileName}</span>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="title">
              Título
            </label>
            <Input id="title" name="title" defaultValue="Propuesta Premium Demo" />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="clientName">
              Cliente
            </label>
            <Input id="clientName" name="clientName" defaultValue="Cliente demo" />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="niche">
              Nicho
            </label>
            <Input id="niche" name="niche" defaultValue="Negocio local" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="html">
            HTML completo
          </label>
          <Textarea
            id="html"
            name="html"
            className="min-h-[420px] font-mono text-xs"
            value={html}
            onChange={(event) => setHtml(event.target.value)}
          />
        </div>

        <Button type="submit" className="gap-2">
          <Rocket className="size-4" />
          Guardar y generar link público
        </Button>
      </form>

      <section className="overflow-hidden rounded-2xl border bg-background">
        <ContainerScroll
          titleComponent={
            <div className="mx-auto max-w-xl px-4">
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border bg-primary/10 text-primary">
                <Smartphone className="size-6" />
              </div>
              <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
                Visor HTML · Admin Preview
              </p>
              <h2 className="mt-2 font-bold text-2xl tracking-tight md:text-4xl">
                Vista animada del HTML antes de publicar
              </h2>
              <p className="mt-3 text-muted-foreground text-sm">
                Importa o edita tu HTML y revisa cómo se verá dentro del visor interactivo.
              </p>
            </div>
          }
        >
          <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white">
            <div className="flex h-10 items-center justify-between border-b bg-neutral-950 px-4 text-[11px] text-white">
              <span>Preview</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3" />
                Live
              </span>
            </div>

            <iframe
              title="Preview HTML en ContainerScroll"
              srcDoc={previewHtml}
              sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              className="h-full w-full border-0 bg-white"
            />
          </div>
        </ContainerScroll>

        <p className="px-4 pb-4 text-center text-muted-foreground text-xs">
          Este visor no guarda cambios automáticamente. Para publicar, presiona “Guardar y generar link público”.
        </p>
      </section>
    </div>
  );
}
