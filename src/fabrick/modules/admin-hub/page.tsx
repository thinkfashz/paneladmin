import Link from "next/link";

import { CheckCircle2, CircleDashed } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fabrickModuleGroups } from "@/fabrick/modules/registry";

export default function AdminHubModulePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Soluciones Fabrick · Mapa modular
        </p>
        <h1 className="mt-2 font-bold text-2xl tracking-tight md:text-3xl">
          Centro de módulos
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground text-sm">
          Cada opción de la app tiene su carpeta, su documentación y su historial de cambios.
          Desde aquí puedes entrar a módulos activos o próximos módulos sin crear una segunda barra lateral.
        </p>
      </section>

      {fabrickModuleGroups.map((group) => (
        <section key={group.title} className="flex flex-col gap-3">
          <div>
            <h2 className="font-semibold text-lg">{group.title}</h2>
            <p className="text-muted-foreground text-sm">
              {group.items.length} módulo{group.items.length === 1 ? "" : "s"}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.items.map(({ id, title, description, href, status, icon: Icon }) => (
              <Link key={id} href={href || "/admin"} className="group">
                <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-primary/5 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base">{title}</CardTitle>
                      <CardDescription className="mt-1 text-xs">{href || "infraestructura"}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{description}</p>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Badge variant={status === "coming-soon" ? "outline" : "secondary"} className="gap-1">
                        {status === "coming-soon" ? <CircleDashed className="size-3" /> : <CheckCircle2 className="size-3" />}
                        {status}
                      </Badge>
                      <span className="text-primary text-xs font-medium transition-transform group-hover:translate-x-0.5">
                        Abrir →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
