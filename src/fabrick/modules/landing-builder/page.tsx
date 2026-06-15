import Link from "next/link";

import { CheckCircle2, ExternalLink, FileText, Globe2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateGeneratedPageForm } from "./components/create-page-form";
import { ProspectCrmPanel } from "./components/prospect-crm-panel";
import { listGeneratedPages } from "./services/page-engine-service";
import { getProspectById, listProspects } from "./services/prospects-service";

export const dynamic = "force-dynamic";

export default async function LandingBuilderModulePage({
  searchParams,
}: {
  searchParams?: Promise<{
    error?: string;
    created?: string;
    type?: string;
    imported?: string;
    prospect?: string;
  }>;
}) {
  const params = await searchParams;
  const result = await listGeneratedPages();
  const prospectsResult = await listProspects();
  const selectedProspect = params?.prospect ? await getProspectById(params.prospect) : null;

  const errorMessage =
    params?.error === "missing-title"
      ? "Debes ingresar un título."
      : params?.error === "invalid-html"
        ? "Debes ingresar un HTML completo que incluya la etiqueta <html>."
        : params?.error === "invalid-react"
          ? "Debes ingresar código React que incluya function App."
          : params?.error === "missing-prospect-json"
            ? "Debes importar un archivo JSON antes de guardar prospectos."
            : params?.error === "invalid-prospect-json"
              ? "El archivo importado no contiene JSON válido."
              : params?.error === "prospect-import-failed"
                ? "No se pudieron importar los prospectos. Revisa InsForge."
                : params?.error === "create-failed"
                  ? "No se pudo crear la página. Revisa la conexión con InsForge."
                  : null;

  const initialValues = selectedProspect
    ? {
        title: `Landing para ${selectedProspect.brandName}`,
        clientName: selectedProspect.brandName,
        niche: selectedProspect.projectName || "Prospecto comercial",
        prospectId: selectedProspect.id,
      }
    : undefined;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Fabrick Page Engine · CRM Demo Engine
        </p>
        <h1 className="mt-2 flex items-center gap-2 font-bold text-2xl tracking-tight md:text-3xl">
          <Globe2 className="size-7" />
          Motor de páginas + prospectos
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground text-sm">
          Importa prospectos desde JSON, revisa la información comercial y crea una demo compartible con link público.
        </p>
      </section>

      {errorMessage && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      {params?.imported && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-emerald-700 text-sm dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          Prospectos importados: {params.imported}
        </div>
      )}

      {params?.created && (
        <div className="flex flex-col gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="size-4" />
            Demo creada correctamente. Token: <span className="font-mono">{params.created}</span>
          </div>

          <Link
            href={`/p/${params.created}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-white"
          >
            Abrir demo
            <ExternalLink className="size-4" />
          </Link>
        </div>
      )}

      <ProspectCrmPanel
        prospects={prospectsResult.prospects}
        selectedProspectId={params?.prospect || null}
      />

      {selectedProspect && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <p className="font-semibold">Creando demo para: {selectedProspect.brandName}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            Al guardar, el link de la página quedará asociado al prospecto dentro del CRM.
          </p>
        </div>
      )}

      <CreateGeneratedPageForm initialValues={initialValues} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-4" />
            Páginas recientes
          </CardTitle>
          <CardDescription>
            Últimas páginas creadas en la base de datos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {!result.ok && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
              {result.message}
            </div>
          )}

          {result.pages.length === 0 ? (
            <p className="text-muted-foreground text-sm">Todavía no hay páginas creadas.</p>
          ) : (
            <div className="space-y-2">
              {result.pages.map((page) => (
                <div key={page.id} className="flex flex-col gap-3 rounded-xl border p-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{page.title}</p>
                      <Badge variant="secondary">{page.status}</Badge>
                      <Badge variant="outline">{page.contentType}</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Cliente: {page.clientName || "Sin cliente"} · Nicho: {page.niche || "Sin nicho"}
                    </p>
                    <p className="text-muted-foreground text-xs">Token: {page.token}</p>
                  </div>

                  <ButtonLink href={`/p/${page.token}`} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function ButtonLink({ href }: { href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-primary-foreground text-sm"
    >
      Abrir público
      <ExternalLink className="size-4" />
    </Link>
  );
}
