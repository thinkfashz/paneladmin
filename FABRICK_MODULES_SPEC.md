# Fabrick Modules Spec

## Objetivo

Toda funcionalidad debe vivir en su propio módulo dentro de `src/fabrick/modules`.

## Regla

- `src/app/...` solo debe contener wrappers de ruta.
- `src/fabrick/modules/<modulo>/page.tsx` contiene la pantalla real.
- `MODULE.md` explica la lógica del módulo.
- `CHANGELOG.md` registra cambios por instrucción.
- `components/` contiene UI interna.
- `actions/` contiene server actions.
- `services/` contiene datos/adaptadores.
- `types.ts` contiene tipos.
- `data.ts` contiene datos demo/constantes.

## Módulos creados

Core:
- app-shell
- admin-hub
- database-status

Dashboards:
- dashboard-default
- dashboard-crm
- dashboard-finance
- dashboard-analytics
- dashboard-productivity
- dashboard-ecommerce
- dashboard-academy
- dashboard-logistics

Pages:
- email
- chat
- calendar
- kanban
- invoice
- users
- roles
- authentication
- others

Business:
- crm
- customers
- quotes

Finance/Brand/Analytics:
- accounting-f29
- design
- analytics
- page-analytics

Growth:
- landing-builder
- templates
- generated-pages
- public-token-pages

Commerce:
- ecommerce
- checkout

Settings:
- business-settings
- integrations

## App Shell Global

El módulo `app-shell` arropa:
- Admin
- E-commerce
- Página pública
- Auth
- Setup
- Landing pública
- Navegación
- Branding
- Estado global

No debe contener lógica específica de negocio.

## Corrección de rutas duplicadas

Se eliminaron wrappers en `src/app/dashboard/*` porque las rutas reales ya viven dentro de `src/app/(main)/dashboard/*`.

En Next.js, los route groups como `(main)` no forman parte de la URL, por eso:

- `src/app/dashboard/default/page.tsx`
- `src/app/(main)/dashboard/default/page.tsx`

ambos resuelven a `/dashboard/default` y causan error de build.

Regla:
No crear wrappers duplicados fuera del route group cuando ya exista la ruta dentro de `(main)`.
