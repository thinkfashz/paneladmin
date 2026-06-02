import { getDatabaseConnectionHealth } from "@/fabrick/database/connection-health";
import {
  databaseCapabilities,
  databaseRecommendation,
  getProviderEnvStatus,
} from "@/fabrick/database/database-comparison";
import { databaseProviders } from "@/fabrick/database/providers";

export const dynamic = "force-dynamic";

type StatusBadgeProps = {
  ok: boolean;
  label: string;
};

function StatusBadge({ ok, label }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 font-medium text-xs ${
        ok
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
      }`}
    >
      {label}
    </span>
  );
}

export default async function DatabaseSystemPage() {
  const envStatus = getProviderEnvStatus(process.env);
  const health = await getDatabaseConnectionHealth();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-muted-foreground text-sm">Superadmin / Sistema</p>
          <h1 className="font-semibold text-3xl tracking-tight">Conexion de bases de datos</h1>
          <p className="max-w-3xl text-muted-foreground">
            Panel de diagnostico para revisar InsForge, Supabase y PocketBase antes de construir los modulos de auth,
            seguridad, demos 72h, store, CRM y agenda.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {health.map((item) => (
          <article key={item.provider} className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-lg capitalize">{item.provider}</h2>
                <p className="mt-1 text-muted-foreground text-sm">{item.message}</p>
              </div>
              <StatusBadge ok={item.ok} label={item.ok ? "OK" : item.configured ? "Error" : "Falta config"} />
            </div>
            <p className="mt-4 text-muted-foreground text-xs">Revisado: {item.checkedAt}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold text-xl">Recomendacion actual</h2>
        <p className="mt-2 text-muted-foreground">{databaseRecommendation.message}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Backend activo</p>
            <p className="font-semibold text-lg">{databaseRecommendation.primary}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Alternativa SaaS</p>
            <p className="font-semibold text-lg">{databaseRecommendation.secondary}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-muted-foreground text-sm">Local/demo</p>
            <p className="font-semibold text-lg">{databaseRecommendation.local}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold text-xl">Variables de entorno requeridas</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4">Proveedor</th>
                <th className="py-3 pr-4">Estado</th>
                <th className="py-3 pr-4">Presentes</th>
                <th className="py-3 pr-4">Faltantes</th>
              </tr>
            </thead>
            <tbody>
              {envStatus.map((provider) => (
                <tr key={provider.id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{provider.name}</td>
                  <td className="py-3 pr-4">
                    <StatusBadge ok={provider.configured} label={provider.configured ? "Completo" : "Incompleto"} />
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{provider.presentKeys.join(", ") || "Ninguna"}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{provider.missingKeys.join(", ") || "Ninguna"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold text-xl">Comparativa rapida</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4">Criterio</th>
                <th className="py-3 pr-4">Supabase</th>
                <th className="py-3 pr-4">PocketBase</th>
                <th className="py-3 pr-4">InsForge</th>
              </tr>
            </thead>
            <tbody>
              {databaseCapabilities.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{row.label}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.supabase}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.pocketbase}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{row.insforge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {databaseProviders.map((provider) => (
          <article key={provider.id} className="rounded-2xl border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-lg">{provider.name}</h2>
                <p className="mt-1 text-muted-foreground text-sm">{provider.purpose}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground text-xs capitalize">
                {provider.status}
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="font-medium">Ideal para</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {provider.bestFor.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium">Riesgos</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {provider.risks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              <a className="underline underline-offset-4" href={provider.docsUrl} target="_blank" rel="noreferrer">
                Documentacion
              </a>
              <a className="underline underline-offset-4" href={provider.setupUrl} target="_blank" rel="noreferrer">
                Guia setup
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold text-xl">Checklist de seguridad</h2>
        <ul className="mt-4 grid gap-2 text-muted-foreground text-sm md:grid-cols-2">
          <li>✓ No guardar user-api-keys dentro del repositorio.</li>
          <li>✓ Usar variables de entorno o secrets del deploy.</li>
          <li>✓ Mantener service role keys solo en servidor.</li>
          <li>✓ Probar conexion antes de crear modulos.</li>
          <li>✓ Separar datos por business_id.</li>
          <li>✓ Registrar eventos de demo y accesos.</li>
        </ul>
      </section>
    </main>
  );
}
