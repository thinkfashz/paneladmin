# 01 - Plantilla de pagina visual

## Archivo destino recomendado

Crear una pagina dentro del area privada del panel maestro.

Ruta sugerida cuando lo actives manualmente:

`src/app/[AREA_PRIVADA]/system-control/page.tsx`

Luego reemplaza `[AREA_PRIVADA]` por la carpeta real que uses para el rol maestro.

## Objetivo

Crear una pagina que:

- Lea el proveedor activo.
- Lea los items del modulo `system-control`.
- Consulte el rol real del usuario.
- Renderice el componente visual.
- No muestre opciones si el usuario no tiene rol maestro.

## Codigo base

Copia esta estructura y ajusta imports segun tu ruta final:

~~~tsx
import { SystemControlUI } from "@/fabrick/system-control/ui";
import { systemControlItems } from "@/fabrick/system-control/items";
import { getRuntimeProvider } from "@/fabrick/system-control/provider";

export const dynamic = "force-dynamic";

async function getCurrentRole() {
  // TODO: Reemplazar por auth real.
  return process.env.DEV_MASTER_MODE === "true" ? "superadmin" : null;
}

export default async function SystemControlPage() {
  const role = await getCurrentRole();
  const provider = getRuntimeProvider();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6">
      <SystemControlUI role={role} provider={provider} items={systemControlItems} />
    </main>
  );
}
~~~

## Seguridad

Antes de produccion elimina `DEV_MASTER_MODE` y reemplazalo por una sesion real con rol desde la base de datos.
