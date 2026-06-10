import { buildEnvTemplate, ENV_GROUPS, getEnvVariableStatuses } from "@/fabrick/setup/env-reference";

import { CopyEnvTemplate } from "./_components/copy-env-template";

export const dynamic = "force-dynamic";

type SourceBadgeProps = {
  source: "env" | "asistente" | "faltante";
  required: boolean;
};

function SourceBadge({ source, required }: SourceBadgeProps) {
  if (source === "env") {
    return (
      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 text-xs dark:bg-green-950 dark:text-green-300">
        Definida en entorno
      </span>
    );
  }

  if (source === "asistente") {
    return (
      <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-xs dark:bg-blue-950 dark:text-blue-300">
        Guardada por el asistente
      </span>
    );
  }

  if (required) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 font-medium text-red-700 text-xs dark:bg-red-950 dark:text-red-300">
        Faltante (requerida)
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground text-xs">
      No configurada (opcional)
    </span>
  );
}

export default function EnvVariablesPage() {
  const statuses = getEnvVariableStatuses();
  const template = buildEnvTemplate();

  const requiredMissing = statuses.filter((s) => s.required && s.source === "faltante");

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          <p className="font-medium text-muted-foreground text-sm">Superadmin / Sistema</p>
          <h1 className="font-semibold text-3xl tracking-tight">Variables y claves</h1>
          <p className="max-w-3xl text-muted-foreground">
            Lista completa de las variables de entorno y claves que necesita el panel: que es cada una, donde se
            consigue y su estado actual. Los valores secretos se muestran siempre enmascarados; nunca se exponen
            completos en esta pagina.
          </p>
          {requiredMissing.length > 0 ? (
            <p className="rounded-lg bg-red-50 p-3 font-medium text-red-700 text-sm dark:bg-red-950 dark:text-red-300">
              Faltan {requiredMissing.length} variable(s) requerida(s): {requiredMissing.map((v) => v.name).join(", ")}.
              Configuralas en tus secretos o completa el asistente de primer inicio en /setup.
            </p>
          ) : (
            <p className="rounded-lg bg-green-50 p-3 font-medium text-green-700 text-sm dark:bg-green-950 dark:text-green-300">
              Todas las variables requeridas estan configuradas.
            </p>
          )}
        </div>
      </section>

      {ENV_GROUPS.map((group) => {
        const vars = statuses.filter((s) => s.group === group);
        if (vars.length === 0) return null;

        return (
          <section key={group} className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="font-semibold text-xl tracking-tight">{group}</h2>
            <div className="mt-4 flex flex-col gap-4">
              {vars.map((variable) => (
                <article key={variable.name} className="rounded-xl border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <code className="font-mono font-semibold text-sm">{variable.name}</code>
                    <SourceBadge source={variable.source} required={variable.required} />
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">{variable.description}</p>
                  <p className="mt-1 text-muted-foreground text-sm">
                    <span className="font-medium text-foreground">Donde conseguirla:</span> {variable.howToGet}
                  </p>
                  {variable.displayValue && (
                    <p className="mt-1 font-mono text-muted-foreground text-xs">
                      Valor actual: {variable.displayValue}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}

      <section className="rounded-2xl border bg-background p-6 shadow-sm">
        <h2 className="font-semibold text-xl tracking-tight">Plantilla .env lista para copiar</h2>
        <p className="mt-1 mb-4 max-w-3xl text-muted-foreground text-sm">
          Pega esta plantilla en tu <code>.env.local</code> (desarrollo) o en los secretos de tu hosting (produccion) y
          completa los valores. Recuerda: en Vercel el filesystem es efimero, asi que en produccion estas variables
          deben vivir si o si en los secretos del hosting.
        </p>
        <CopyEnvTemplate template={template} />
      </section>
    </main>
  );
}
