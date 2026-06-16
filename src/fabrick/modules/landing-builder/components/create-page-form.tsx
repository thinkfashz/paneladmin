"use client";

import { useMemo, useRef, useState } from "react";

import { Code2, Eye, FileUp, Rocket, Smartphone, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { createGeneratedPageAction } from "../actions/create-generated-page";
import { demoLandingHtml, demoReactCode, demoReactCss } from "../data";
import { buildReactDemoHtml } from "../services/page-engine-service";
import type { GeneratedPageContentType } from "../types";

const businessTypes = [
  "Producción Audiovisual",
  "Clínica Dental",
  "Óptica",
  "Belleza y estética",
  "Restaurante / Cafetería",
  "Construcción",
  "Tienda / E-commerce",
  "Servicio profesional",
  "Negocio local",
];

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
    if (contentType === "react") return buildReactDemoHtml(reactCode, css);

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
    <div id="landing-demo-builder" className="scroll-mt-24 space-y-4">
      <form action={createGeneratedPageAction} className="overflow-hidden rounded-[2rem] border bg-background shadow-sm">
        <div className="flex flex-col gap-4 border-b bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Code2 className="size-5" />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight">Crear demo</h2>
              <p className="text-muted-foreground text-sm">Configura la demo con datos del prospecto y revisa el preview móvil.</p>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept=".html,.htm,.jsx,.tsx,.js,text/html" className="hidden" onChange={handleFileImport} />
          <Button type="button" variant="outline" className="gap-2 rounded-xl" onClick={() => fileInputRef.current?.click()}>
            <Upload className="size-4" />
            Importar archivo
          </Button>
        </div>

        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)]">
          <div className="space-y-4">
            {fileName && (
              <div className="rounded-xl border bg-muted/40 px-3 py-2 text-muted-foreground text-sm">
                Archivo importado: <span className="font-medium text-foreground">{fileName}</span>
              </div>
            )}

            <input type="hidden" name="contentType" value={contentType} />
            <input type="hidden" name="prospectId" value={initialValues?.prospectId || ""} />

            <div className="grid gap-2 rounded-2xl border bg-muted/20 p-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setContentType("html")}
                className={`rounded-xl px-4 py-3 font-semibold text-sm transition ${
                  contentType === "html" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background"
                }`}
              >
                HTML
              </button>
              <button
                type="button"
                onClick={() => setContentType("react")}
                className={`rounded-xl px-4 py-3 font-semibold text-sm transition ${
                  contentType === "react" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-background"
                }`}
              >
                React Demo
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="font-medium text-sm" htmlFor="title">Título de la demo</label>
                <Input id="title" name="title" defaultValue={initialValues?.title || "Cotiza tu video profesional"} />
              </div>
              <div className="space-y-2">
                <label className="font-medium text-sm" htmlFor="clientName">Nombre del prospecto</label>
                <Input id="clientName" name="clientName" defaultValue={initialValues?.clientName || "Cliente demo"} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="font-medium text-sm" htmlFor="niche">Tipo de negocio</label>
                <select
                  id="niche"
                  name="niche"
                  defaultValue={initialValues?.niche || "Producción Audiovisual"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {contentType === "html" ? (
              <div className="space-y-2">
                <label className="font-medium text-sm" htmlFor="html">HTML completo</label>
                <Textarea id="html" name="html" className="min-h-[360px] rounded-2xl font-mono text-xs" value={html} onChange={(event) => setHtml(event.target.value)} />
                <input type="hidden" name="reactCode" value={reactCode} />
                <input type="hidden" name="css" value={css} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="font-medium text-sm" htmlFor="reactCode">Código React</label>
                  <Textarea id="reactCode" name="reactCode" className="min-h-[320px] rounded-2xl font-mono text-xs" value={reactCode} onChange={(event) => setReactCode(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="font-medium text-sm" htmlFor="css">CSS opcional</label>
                  <Textarea id="css" name="css" className="min-h-[110px] rounded-2xl font-mono text-xs" value={css} onChange={(event) => setCss(event.target.value)} />
                </div>
                <input type="hidden" name="html" value={html} />
              </div>
            )}

            <Button type="submit" className="w-full gap-2 rounded-xl py-6 text-base sm:w-auto sm:px-6">
              <Rocket className="size-4" />
              Guardar demo y generar link
            </Button>
          </div>

          <section className="overflow-hidden rounded-[2rem] border bg-gradient-to-b from-background to-muted/20 p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between px-1">
              <div>
                <p className="flex items-center gap-2 font-semibold text-sm">
                  <Eye className="size-4" />
                  Visor móvil
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-700 text-xs">
                    <span className="size-1.5 rounded-full bg-emerald-500" /> Live preview
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">Preview largo tipo iPhone para recorrer la landing completa.</p>
              </div>
              <div className="rounded-xl border bg-background p-2 text-primary">
                <Smartphone className="size-4" />
              </div>
            </div>

            <div className="relative mx-auto h-[82dvh] min-h-[720px] w-full max-w-[430px] overflow-hidden rounded-[3.1rem] border-[10px] border-neutral-950 bg-neutral-950 p-2 shadow-[0_42px_120px_rgba(0,0,0,.30)] lg:h-[calc(100dvh-11rem)] lg:max-h-[980px]">
              <div className="absolute left-1/2 top-2 z-20 h-7 w-32 -translate-x-1/2 rounded-b-3xl bg-neutral-950" />
              <div className="absolute left-1/2 top-4 z-30 h-1.5 w-14 -translate-x-1/2 rounded-full bg-neutral-700" />
              <div className="flex h-full w-full flex-col overflow-hidden rounded-[2.25rem] border border-white/10 bg-white">
                <div className="flex h-11 shrink-0 items-center justify-between border-b bg-neutral-950 px-5 text-[11px] text-white">
                  <span>{contentType === "react" ? "React Demo" : "HTML Preview"}</span>
                  <span className="inline-flex items-center gap-1"><Eye className="size-3" /> Live</span>
                </div>
                <iframe
                  title="Preview demo compartible"
                  srcDoc={previewHtml}
                  sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
                  className="h-full min-h-0 flex-1 border-0 bg-white"
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
