"use client";

import { useMemo, useRef, useState } from "react";

import { Code2, Eye, FileUp, Rocket, Smartphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createGeneratedPageAction } from "../actions/create-generated-page";
import { demoLandingHtml, demoReactCode, demoReactCss } from "../data";
import { buildReactDemoHtml } from "../services/page-engine-service";
import type { GeneratedPageContentType } from "../types";

export function CreateGeneratedPageForm({
  initialValues,
}: {
  initialValues?: {
    title?: string;
    clientName?: string;
    niche?: string;
    prospectId?: string;
  };
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [contentType, setContentType] = useState<GeneratedPageContentType>("html");
  const [html, setHtml] = useState(demoLandingHtml);
  const [reactCode, setReactCode] = useState(demoReactCode);
  const [css, setCss] = useState(demoReactCss);
  const [fileName, setFileName] = useState<string | null>(null);

  const previewHtml = useMemo(() => {
    if (contentType === "react") {
      return buildReactDemoHtml(reactCode, css);
    }

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
  }, [contentType, html, reactCode, css]);

  async function handleFileImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const isHtml =
      file.type === "text/html" ||
      file.name.toLowerCase().endsWith(".html") ||
      file.name.toLowerCase().endsWith(".htm");

    const isReact =
      file.name.toLowerCase().endsWith(".jsx") ||
      file.name.toLowerCase().endsWith(".tsx") ||
      file.name.toLowerCase().endsWith(".js");

    if (!isHtml && !isReact) {
      alert("Selecciona un archivo .html, .htm, .jsx, .tsx o .js");
      event.target.value = "";
      return;
    }

    const content = await file.text();

    if (isReact) {
      setContentType("react");
      setReactCode(content);
    } else {
      setContentType("html");
      setHtml(content);
    }

    setFileName(file.name);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.82fr)_minmax(360px,1.18fr)]">
      <form action={createGeneratedPageAction} className="space-y-4 rounded-2xl border bg-background p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="size-5" />
            <div>
              <h2 className="font-semibold text-lg">Crear demo</h2>
              <p className="text-muted-foreground text-sm">
                Carga HTML o pega una app React simple y compártela por link.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".html,.htm,.jsx,.tsx,.js,text/html"
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
              Importar archivo
            </Button>
          </div>
        </div>

        {fileName && (
          <div className="rounded-xl border bg-muted/40 px-3 py-2 text-muted-foreground text-sm">
            Archivo importado: <span className="font-medium text-foreground">{fileName}</span>
          </div>
        )}

        <input type="hidden" name="contentType" value={contentType} />
        <input type="hidden" name="prospectId" value={initialValues?.prospectId || ""} />

        <div className="grid gap-2 rounded-xl border bg-muted/30 p-2 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setContentType("html")}
            className={`rounded-lg px-4 py-3 font-medium text-sm ${
              contentType === "html" ? "bg-primary text-primary-foreground" : "hover:bg-background"
            }`}
          >
            HTML
          </button>

          <button
            type="button"
            onClick={() => setContentType("react")}
            className={`rounded-lg px-4 py-3 font-medium text-sm ${
              contentType === "react" ? "bg-primary text-primary-foreground" : "hover:bg-background"
            }`}
          >
            React Demo
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="title">
              Título
            </label>
            <Input id="title" name="title" defaultValue={initialValues?.title || "Demo compartible Fabrick"} />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="clientName">
              Cliente
            </label>
            <Input id="clientName" name="clientName" defaultValue={initialValues?.clientName || "Cliente demo"} />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm" htmlFor="niche">
              Nicho
            </label>
            <Input id="niche" name="niche" defaultValue={initialValues?.niche || "Negocio local"} />
          </div>
        </div>

        {contentType === "html" ? (
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
            <input type="hidden" name="reactCode" value={reactCode} />
            <input type="hidden" name="css" value={css} />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="reactCode">
                Código React
              </label>
              <Textarea
                id="reactCode"
                name="reactCode"
                className="min-h-[360px] font-mono text-xs"
                value={reactCode}
                onChange={(event) => setReactCode(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="css">
                CSS opcional
              </label>
              <Textarea
                id="css"
                name="css"
                className="min-h-[120px] font-mono text-xs"
                value={css}
                onChange={(event) => setCss(event.target.value)}
              />
            </div>

            <input type="hidden" name="html" value={html} />
          </div>
        )}

        <Button type="submit" className="gap-2">
          <Rocket className="size-4" />
          Guardar demo y generar link
        </Button>
      </form>

      <section className="overflow-hidden rounded-[2rem] border bg-gradient-to-b from-background to-muted/20 p-3 shadow-sm xl:sticky xl:top-24 xl:min-h-[calc(100dvh-7rem)]">
        <div className="flex min-h-[82dvh] flex-col items-center justify-center gap-5 xl:h-[calc(100dvh-9rem)] xl:min-h-[720px] xl:max-h-[980px]">
          <div className="mx-auto max-w-xl px-4 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border bg-primary/10 text-primary">
              <Smartphone className="size-6" />
            </div>
            <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
              Visor {contentType === "react" ? "React" : "HTML"} · Admin Preview
            </p>
            <h2 className="mt-2 font-bold text-2xl tracking-tight md:text-4xl">
              Demo compartible antes de publicar
            </h2>
            <p className="mt-3 text-muted-foreground text-sm">
              Vista tipo iPhone, centrada y lista para revisar antes de generar el link público.
            </p>
          </div>

          <div className="relative mx-auto h-[78dvh] min-h-[620px] w-full max-w-[430px] rounded-[3.2rem] border-[10px] border-neutral-900 bg-neutral-950 p-2 shadow-[0_42px_120px_rgba(0,0,0,.36)] xl:h-full">
            <div className="absolute left-1/2 top-2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-neutral-950" />
            <div className="absolute left-1/2 top-4 z-30 h-1.5 w-14 -translate-x-1/2 rounded-full bg-neutral-700" />

            <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.35rem] border border-white/10 bg-white">
              <div className="flex h-11 shrink-0 items-center justify-between border-b bg-neutral-950 px-5 text-[11px] text-white">
                <span>{contentType === "react" ? "React Demo" : "HTML Preview"}</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="size-3" />
                  Live
                </span>
              </div>

              <iframe
                title="Preview demo compartible"
                srcDoc={previewHtml}
                sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                className="h-full min-h-0 flex-1 border-0 bg-white"
              />
            </div>
          </div>

          <p className="max-w-xl px-4 text-center text-muted-foreground text-xs">
            El visor ocupa casi toda la pantalla. Sigue bajando para salir del preview y ver la lista de links generados.
          </p>
        </div>
      </section>
    </div>
  );
}
