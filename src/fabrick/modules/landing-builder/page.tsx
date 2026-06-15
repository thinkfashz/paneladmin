import Link from "next/link";

import { ExternalLink, FileText, Globe2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateGeneratedPageForm } from "./components/create-page-form";
import { listGeneratedPages } from "./services/page-engine-service";

export const dynamic = "force-dynamic";

export default async function LandingBuilderModulePage() {
  const result = await listGeneratedPages();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Fabrick Page Engine · MVP
        </p>
        <h1 className="mt-2 flex items-center gap-2 font-bold text-2xl tracking-tight md:text-3xl">
          <Globe2 className="size-7" />
          Motor de páginas HTML
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground text-sm">
          Crea una página HTML, guárdala en InsForge y compártela con un link público único.
        </p>
      </section>

      <CreateGeneratedPageForm />

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
