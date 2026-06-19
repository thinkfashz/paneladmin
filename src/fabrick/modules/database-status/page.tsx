import { CheckCircle2, CircleAlert, Database, Server } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getProviderStatus() {
  const provider = process.env.DATABASE_PROVIDER || "sin definir";

  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const hasInsForge = Boolean(
    (process.env.NEXT_PUBLIC_INSFORGE_URL || process.env.INSFORGE_API_URL || process.env.INSFORGE_BASE_URL) &&
      (process.env.INSFORGE_SERVICE_ROLE_KEY || process.env.INSFORGE_API_KEY || process.env.INSFORGE_ANON_KEY),
  );

  const connected =
    provider === "insforge" ? hasInsForge : provider === "supabase" ? hasSupabase : hasSupabase || hasInsForge;

  return {
    provider,
    connected,
    checkedAt: new Date().toLocaleString("es-CL"),
  };
}

export default function DatabaseStatusModulePage() {
  const status = getProviderStatus();
  const Icon = status.connected ? CheckCircle2 : CircleAlert;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Sistema · Base de datos
        </p>
        <h1 className="mt-2 font-bold text-2xl tracking-tight md:text-3xl">
          Estado de conexión
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
          Verificación liviana del proveedor y variables configuradas.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="size-4" />
              Proveedor
            </CardTitle>
            <CardDescription>Proveedor detectado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl capitalize">{status.provider}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="size-4" />
              Conexión
            </CardTitle>
            <CardDescription>Estado de configuración</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={status.connected ? "default" : "destructive"} className="gap-1">
              <Icon className="size-3" />
              {status.connected ? "Conectado" : "No configurado"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Última revisión</CardTitle>
            <CardDescription>Calculada en servidor</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-sm">{status.checkedAt}</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
