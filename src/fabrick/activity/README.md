# Activity Module

Modulo responsable de registrar actividad y accesos del sistema.

## Objetivo

Registrar informacion util para seguridad y auditoria:

- Evento.
- Ruta visitada.
- Metodo.
- Usuario.
- Email.
- Negocio.
- IP en hash.
- IP enmascarada.
- User agent.
- Tipo de dispositivo.
- Navegador.
- Sistema operativo.
- Referer.
- Metadata.
- Fecha y hora.

## Archivos

- `types.ts`: tipos base.
- `device.ts`: deteccion de dispositivo, navegador y sistema operativo.
- `ip.ts`: extraccion, hash y mascara de IP.
- `create-activity-record.ts`: crea el payload normalizado.
- `write-activity-record.ts`: orquesta escritura segun proveedor activo.
- `get-activity-records.ts`: lectura futura para panel superadmin.
- `provider.ts`: selecciona InsForge, Supabase, PocketBase o consola.
- `adapters/`: adaptadores por proveedor.

## Orden de proveedor

1. InsForge
2. Supabase
3. PocketBase
4. Console fallback

## Seguridad

No se guarda IP completa en texto plano.

Se guarda:

- `ip_hash`: para auditoria.
- `ip_masked`: para referencia visual.

## Pendiente

- Crear coleccion o tabla `activity_records` en el proveedor activo.
- Conectar middleware.
- Conectar login real.
- Mostrar actividad en superadmin.
