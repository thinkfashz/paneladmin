"use client";

import { useMemo, useRef, useState } from "react";

import { Code2, Eye, FileUp, Rocket, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createGeneratedPageAction } from "../actions/create-generated-page";
import { demoLandingHtml } from "../data";

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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
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

      <section className="rounded-2xl border bg-background p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Smartphone className="size-5" />
            <div>
              <h2 className="font-semibold text-lg">Preview móvil</h2>
              <p className="text-muted-foreground text-sm">Vista adaptada a iPhone 17</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border bg-muted px-3 py-1 text-xs">
            <Eye className="size-3" />
            Live
          </div>
        </div>

        <div className="mx-auto w-full max-w-[390px] rounded-[3rem] border border-black/20 bg-neutral-950 p-3 shadow-2xl">
          <div className="relative overflow-hidden rounded-[2.4rem] bg-black">
            <div className="absolute left-1/2 top-2 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-black" />

            <div className="flex h-9 items-center justify-between bg-black px-7 pt-2 text-[10px] text-white">
              <span>9:41</span>
              <span>●●● 5G 🔋</span>
            </div>

            <iframe
              title="Preview HTML móvil"
              srcDoc={previewHtml}
              sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin"
              className="h-[720px] w-full border-0 bg-white"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-muted-foreground text-xs">
          Este visor no guarda cambios automáticamente. Para publicar, presiona “Guardar y generar link público”.
        </p>
      </section>
    </div>
  );
}
