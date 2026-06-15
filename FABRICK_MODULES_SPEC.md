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

## Corrección setup InsForge

Se corrigió `src/fabrick/setup/config-store.ts` para que el setup se considere completo cuando existan variables de entorno de InsForge:

- `NEXT_PUBLIC_INSFORGE_URL` o `INSFORGE_API_URL` o `INSFORGE_BASE_URL`
- `NEXT_PUBLIC_INSFORGE_ANON_KEY` o `INSFORGE_ANON_KEY`
- `INSFORGE_SERVICE_ROLE_KEY` o `INSFORGE_API_KEY`
- `ACCESS_LOG_SECRET`

También se cambió la regla de fuerza:
- Antes: `FABRICK_SETUP_FORCE=true` mostraba setup siempre.
- Ahora: si hay env completo, no muestra setup.
- Para forzar manualmente se usa `FABRICK_SETUP_FORCE=reset`.

## Corrección login InsForge

Se corrigió `src/fabrick/auth/actions/login-action.ts` para que el login con InsForge use:

- `NEXT_PUBLIC_INSFORGE_URL` o `INSFORGE_API_URL` o `INSFORGE_BASE_URL`
- `INSFORGE_SERVICE_ROLE_KEY` o `INSFORGE_API_KEY`
- Endpoint raw SQL `/api/database/advance/rawsql/unrestricted`

Motivo:
La versión anterior seguía usando `getInsforgeConfig()`, `INSFORGE_PROJECT_ID` y `/rest/v1/profiles`, lo cual no correspondía a la configuración actual.

## Corrección final provider/session InsForge

Se corrigió `src/fabrick/auth/provider.ts` para detectar InsForge con las variables nuevas:

- `DATABASE_PROVIDER=insforge`
- `NEXT_PUBLIC_INSFORGE_URL`
- `INSFORGE_API_URL`
- `INSFORGE_BASE_URL`
- `INSFORGE_SERVICE_ROLE_KEY`
- `INSFORGE_API_KEY`
- `INSFORGE_ANON_KEY`

También se corrigió `src/fabrick/auth/adapters/insforge-auth-adapter.ts` para validar sesiones sin exigir `INSFORGE_PROJECT_ID`.
