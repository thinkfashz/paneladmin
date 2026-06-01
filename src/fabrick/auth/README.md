# Auth Module

Modulo base para autenticacion, roles y acceso seguro.

## Objetivo

Identificar usuario real, rol y negocio antes de permitir acceso a:

- Superadmin.
- Admin de negocio.
- APIs privadas.
- Demos protegidas.
- Consolas internas.

## Archivos creados

- `roles.ts`: roles del sistema.
- `permissions.ts`: permisos por rol.
- `session.ts`: tipos de sesion.
- `guards.ts`: guards logicos.
- `provider.ts`: selector de proveedor auth.
- `types.ts`: tipos auth reales.
- `get-current-user.ts`: orquestador de usuario actual.
- `get-current-role.ts`: helpers de rol y negocio.
- `require-superadmin.ts`: bloqueo para superadmin.
- `require-business-user.ts`: bloqueo para usuarios de negocio.
- `adapters/`: adaptadores por proveedor.

## Proveedores soportados

1. InsForge
2. Supabase
3. PocketBase
4. none

## Modo desarrollo

Existe `DEV_SUPERADMIN_MODE=true` para pruebas locales.

No usar en produccion.

## Pendiente

- Conectar auth real de InsForge.
- Conectar Supabase server cookies con `@supabase/ssr`.
- Conectar PocketBase token/cookie.
- Crear login UI.
- Conectar middleware.
- Registrar intentos en activity.

## Regla critica

No confiar en roles enviados desde el cliente. El rol debe salir de una sesion valida y verificarse en servidor.
