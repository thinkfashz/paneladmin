# Fabrick Admin - AI Implementation Plan

Documento maestro para que cualquier IA o desarrollador entienda el estado del proyecto, los modulos existentes, lo que falta y el metodo correcto para continuar sin romper la arquitectura.

---

## 1. Vision del producto

Fabrick Admin es un sistema SaaS modular para crear paneles administrativos vendibles a negocios locales.

Objetivo comercial inicial:

- Manicuristas
- Barberias
- Restaurantes
- Ferreterias
- Constructoras
- Inmobiliarias
- Negocios de servicios

Objetivo tecnico:

- Dashboard moderno
- Base de datos conectable
- Auth real
- Seguridad por capas
- Superadmin
- Demos privadas de 72 horas
- Branding editable
- Store publica
- CRM
- Agenda
- Activity logs
- Futuro empaquetado PWA/APK

---

## 2. Regla principal de arquitectura

Las rutas viven en:

```txt
src/app
```

La logica de negocio vive en:

```txt
src/fabrick
```

Una IA no debe meter toda la logica dentro de paginas de Next.js. Las paginas solo deben llamar servicios, componentes y modulos ya definidos.

---

## 3. Estado actual por etapas

### 🟢 Base visual dashboard

Estado: iniciado.

El proyecto parte de un dashboard Next.js moderno con Shadcn/Tailwind.

Pendiente:

- Revisar build.
- Revisar dependencias.
- Mantener UI limpia y minimalista.

---

### 🟢 Database base

Carpeta:

```txt
src/fabrick/database
```

Archivos relevantes:

```txt
schema.sql
database-comparison.ts
providers.ts
connection-health.ts
README.md
```

Ya existe:

- Comparativa Supabase / PocketBase / InsForge.
- Proveedores de base.
- Health check.
- Schema SQL base para Supabase/Postgres.

Tablas contempladas:

```txt
businesses
profiles
business_settings
demo_tokens
demo_events
products
services
customers
appointments
orders
quotes
integration_connections
```

Pendiente:

- Crear schema real en InsForge.
- Crear colecciones equivalentes en PocketBase.
- Crear migraciones.
- Crear seeds por nicho.

Metodo para continuar:

1. No cambiar schema completo sin revisar dependencias.
2. Agregar migraciones incrementales.
3. Toda tabla multi-negocio debe usar `business_id`.
4. Separar schema core, activity, demos, store, crm y appointments.

---

### 🟢 Integraciones de base

Carpetas:

```txt
src/fabrick/integrations/supabase
src/fabrick/integrations/pocketbase
src/fabrick/integrations/insforge
```

Ya existe:

- Cliente/test base Supabase.
- Cliente/test base PocketBase.
- Cliente/test base InsForge.
- README por proveedor.

Proveedor activo definido por prioridad:

```txt
1. InsForge
2. Supabase
3. PocketBase
4. Console fallback
```

Pendiente:

- Conectar SDK o endpoint real de InsForge.
- Confirmar formato real de colecciones/tablas InsForge.
- Conectar Supabase SDK si se decide usarlo como proveedor fuerte.
- Conectar PocketBase auth/admin si se usa local.

---

### 🟢 Security base

Carpeta:

```txt
src/fabrick/security
```

Ya existe:

```txt
token.ts
hash.ts
validate-demo-access.ts
audit-log.ts
rate-limit.ts
access-log.ts
security-headers.ts
route-protection.ts
README.md
```

Incluye:

- Tokens seguros.
- Hash HMAC.
- Validacion de demo.
- Rate limit en memoria.
- Auditoria base.
- Registro de accesos base.
- Headers de seguridad.
- Reglas de proteccion de rutas.

Pendiente:

- Conectar middleware global.
- Persistir auditoria en base activa.
- Mover rate limit a Redis/Upstash o proveedor persistente en produccion.
- Crear paginas `/unauthorized` y `/demo-expired`.

Reglas criticas:

- No guardar tokens planos.
- No guardar API keys en GitHub.
- No confiar en datos enviados desde cliente.
- Toda demo se valida en servidor.
- Toda accion sensible debe registrarse.

---

### 🟢 Activity module

Carpeta:

```txt
src/fabrick/activity
```

Archivos:

```txt
types.ts
device.ts
ip.ts
create-activity-record.ts
write-activity-record.ts
get-activity-records.ts
provider.ts
adapters/insforge-activity-adapter.ts
adapters/supabase-activity-adapter.ts
adapters/pocketbase-activity-adapter.ts
README.md
```

Ya existe:

- Tipos de activity.
- Deteccion de dispositivo.
- Deteccion de navegador.
- Deteccion de sistema operativo.
- IP hash.
- IP enmascarada.
- Constructor de payload.
- Adaptadores por proveedor.
- Orquestador de escritura.

Campos del registro:

```txt
event_type
path
method
user_id
user_email
business_id
ip_hash
ip_masked
user_agent
device_type
browser_family
os_family
referer
metadata
created_at
```

Pendiente:

- Crear tabla/coleccion `activity_records` en proveedor activo.
- Conectar middleware.
- Conectar login real.
- Crear vista de activity para superadmin.

Metodo para continuar:

1. Crear coleccion `activity_records` en InsForge.
2. Confirmar endpoint de escritura.
3. Actualizar adaptador InsForge.
4. Conectar `writeActivityRecord()` en middleware y login.

---

### 🟢 Auth base

Carpeta:

```txt
src/fabrick/auth
```

Archivos relevantes:

```txt
roles.ts
permissions.ts
session.ts
guards.ts
provider.ts
types.ts
get-current-user.ts
get-current-role.ts
require-superadmin.ts
require-business-user.ts
adapters/insforge-auth-adapter.ts
adapters/supabase-auth-adapter.ts
adapters/pocketbase-auth-adapter.ts
README.md
```

Ya existe:

- Roles.
- Permisos.
- Guards.
- Selector de proveedor auth.
- Adaptadores placeholder.
- `getCurrentUser()`.
- `getCurrentRole()`.
- `requireSuperadminAuth()`.
- `requireBusinessUserAuth()`.

Roles:

```txt
superadmin
business_owner
staff
demo_viewer
```

Pendiente:

- Conectar sesion real InsForge.
- Conectar Supabase server cookies si se usa Supabase.
- Conectar PocketBase token/cookie si se usa PocketBase.
- Crear login UI.
- Conectar middleware.
- Registrar intentos de login en activity.

Regla critica:

El rol nunca debe venir del cliente. Debe verificarse en servidor usando sesion real y base de datos.

---

### 🟢 Branding base

Carpeta:

```txt
src/fabrick/branding
```

Archivos:

```txt
types.ts
default-brand.ts
get-brand-theme.ts
update-brand-theme.ts
components/brand-loading-screen.tsx
components/brand-loading-gate.tsx
components/brand-preview.tsx
components/branding-form.tsx
README.md
```

Ya existe:

- Tipos de branding.
- Branding por defecto.
- Servicio `getBrandTheme()`.
- Placeholder `updateBrandTheme()`.
- Loading de 3 segundos con logo y barra.
- Gate reutilizable.
- Preview visual.
- Formulario editable.

UI esperada:

- Minimalista.
- Moderna.
- Limpia.
- Tarjetas redondeadas.
- Colores editables.
- Logo editable.
- Loading de 3 segundos al entrar.

Pendiente:

- Conectar `getBrandTheme()` con `business_settings`.
- Conectar `updateBrandTheme()` con proveedor activo.
- Crear subida real de logo.
- Crear pagina de branding dentro del superadmin.
- Aplicar loading en layout real.

Metodo para continuar:

1. Crear pagina privada de branding.
2. Cargar `getBrandTheme()`.
3. Renderizar `BrandingForm`.
4. Al guardar, llamar `updateBrandTheme()`.
5. Persistir en `business_settings`.

---

### 🟡 System Control / Secure Console

Carpetas:

```txt
src/fabrick/superadmin/admin-console
src/fabrick/system-control
src/fabrick/system-control/manual
```

Ya existe:

- Politica de permisos.
- Catalogo de comandos.
- Acciones de schema preparadas.
- Items de system control.
- Detector de proveedor.
- Manual Markdown con plantillas.

Comandos definidos:

```txt
system.health
db.status
db.create_core_tables
db.create_access_logs
db.list_tables
app.files_overview
app.module_map
```

Estado:

- Parte del codigo fue bloqueado por conector GitHub al intentar crear API/UI directa.
- Se dejaron plantillas Markdown para convertir manualmente.

Pendiente:

- Convertir Markdown a TSX/TS cuando sea seguro.
- Crear UI real.
- Crear API controlada.
- Conectar auth superadmin real.
- Conectar logs.
- Permitir acciones solo con confirmacion.

Regla critica:

No crear terminal libre. Solo acciones predefinidas y auditadas.

---

## 4. Modulos que faltan construir

### 🟡 Middleware

Archivo:

```txt
middleware.ts
```

Objetivo:

- Aplicar headers de seguridad.
- Detectar ruta.
- Registrar activity.
- Bloquear rutas privadas.
- Proteger superadmin.
- Proteger admin.
- Proteger APIs privadas.
- Proteger demos.

Metodo seguro:

1. Crear middleware suave.
2. Aplicar headers primero.
3. Registrar activity sin bloquear.
4. Luego bloquear rutas privadas.
5. Probar build.
6. Recién entonces proteger demos y APIs.

No activar bloqueo completo sin auth real.

---

### 🟡 Superadmin real

Carpeta:

```txt
src/fabrick/superadmin
```

Rutas futuras:

```txt
/superadmin
/superadmin/businesses
/superadmin/businesses/new
/superadmin/demos
/superadmin/system/database
/superadmin/activity
/superadmin/branding
```

Objetivo:

- Crear negocios.
- Ver negocios.
- Crear demos.
- Convertir demo en cliente.
- Ver activity logs.
- Ver estado de base.
- Editar branding.

Metodo:

1. Crear servicios primero.
2. Crear componentes despues.
3. Crear paginas al final.
4. Toda accion debe usar `requireSuperadminAuth()`.

---

### 🟡 Demos 72h

Carpeta futura:

```txt
src/fabrick/demos
```

Debe incluir:

```txt
create-demo-token.ts
validate-demo-token.ts
expire-demo.ts
convert-demo-to-client.ts
components/demo-countdown.tsx
components/demo-expired-card.tsx
```

Rutas futuras:

```txt
/demo/[slug]
/demo-expired
```

Reglas:

- Token plano solo se muestra una vez.
- En base se guarda `token_hash`.
- Expiracion se valida en servidor.
- Contador visual no es seguridad.
- Registrar cada visita en activity.

---

### 🟡 Store publica

Carpeta futura:

```txt
src/fabrick/store
```

Debe incluir:

- Pagina publica.
- Productos.
- Servicios.
- Categorias.
- Carrito.
- Checkout WhatsApp.
- Pedido guardado.

Rutas futuras:

```txt
/[businessSlug]
/[businessSlug]/menu
/[businessSlug]/checkout
```

---

### 🟡 CRM

Carpeta futura:

```txt
src/fabrick/crm
```

Debe incluir:

- Clientes.
- Leads.
- Notas.
- Estados.
- Historial.
- Fuente del cliente.

Campos:

```txt
name
phone
email
notes
source
status
tags
last_visit_at
business_id
```

---

### 🟡 Appointments / Agenda

Carpeta futura:

```txt
src/fabrick/appointments
```

Debe incluir:

- Calendario.
- Crear cita.
- Confirmar cita.
- Cancelar cita.
- Asociar cliente.
- Asociar servicio.
- Enviar a WhatsApp.

Estados:

```txt
pending
confirmed
completed
cancelled
no_show
```

---

### 🟡 Templates por nicho

Carpeta futura:

```txt
src/fabrick/templates
```

Primer template recomendado:

```txt
src/fabrick/templates/beauty
```

Debe incluir:

- Servicios de uñas.
- Colores profesionales.
- Copy comercial.
- Seeds demo.
- Clientes demo.
- Agenda demo.
- Store demo.

---

## 5. Metodo de trabajo para otra IA

### Regla 1: trabajar por modulo

No pedir:

```txt
Haz todo el sistema.
```

Pedir:

```txt
Trabaja solo en src/fabrick/branding.
No modifiques otros modulos.
Crea el servicio que conecta updateBrandTheme con business_settings.
No cambies rutas.
No toques middleware.
```

---

### Regla 2: crear primero logica, luego UI, luego rutas

Orden correcto:

```txt
1. types.ts
2. service.ts
3. adapter.ts
4. component.tsx
5. page.tsx
6. route.ts
```

---

### Regla 3: proteger antes de escribir

Antes de cualquier accion que escriba en base:

- Validar usuario.
- Validar rol.
- Validar business_id.
- Registrar activity.
- Manejar error.

---

### Regla 4: no exponer secretos

Nunca poner en GitHub:

- API keys.
- Service role keys.
- User API keys.
- Tokens.
- Passwords.

Usar `.env.local` o secrets del deploy.

---

### Regla 5: todo multi-negocio debe tener business_id

Cualquier dato de cliente, producto, cita, pedido, presupuesto o setting debe estar relacionado con `business_id`.

---

## 6. Prioridad recomendada desde ahora

### Paso 1 🟢

Terminar Branding:

- Conectar `getBrandTheme()` con base.
- Conectar `updateBrandTheme()` con base.
- Crear pagina privada de branding.

### Paso 2 🟡

Crear Middleware suave:

- Headers.
- Activity.
- Sin bloqueo agresivo.

### Paso 3 🟡

Conectar Auth real:

- InsForge auth.
- Rol real.
- Superadmin real.

### Paso 4 🟡

Superadmin:

- Dashboard maestro.
- Activity viewer.
- Branding editor.
- Businesses CRUD.

### Paso 5 🟡

Demos 72h:

- Crear demo.
- Link privado.
- Expiracion.
- Activity.

### Paso 6 🟡

Producto vendible beauty:

- Store.
- CRM.
- Agenda.
- Template beauty.

---

## 7. Checklist de avance

```txt
🟢 Dashboard base
🟢 Database base
🟢 Integraciones base
🟢 Security base
🟢 Activity base
🟢 Auth base
🟢 Branding base
🟢 Loading UI base
🟡 Branding conectado a base
🟡 Middleware suave
🟡 Auth real proveedor activo
🟡 Superadmin real
🟡 Demos 72h
🟡 Store publica
🟡 CRM
🟡 Agenda
🟡 Templates por nicho
🔴 PWA/APK
🔴 Produccion final
```

---

## 8. Prompts recomendados para continuar con otra IA

### Prompt para branding

```txt
Trabaja solo en src/fabrick/branding.
Conecta getBrandTheme y updateBrandTheme con el proveedor activo siguiendo la arquitectura existente.
No modifiques middleware ni rutas.
Toda escritura debe validar business_id.
Mantener fallback defaultBrandTheme.
```

### Prompt para middleware

```txt
Crea middleware suave para Next.js.
Primero aplica headers de seguridad y registra activity usando writeActivityRecord.
No bloquees rutas todavia salvo rutas claramente privadas de prueba.
No rompas el dashboard.
```

### Prompt para auth real

```txt
Trabaja solo en src/fabrick/auth.
Conecta el adaptador del proveedor activo para obtener usuario real, rol y business_id desde servidor.
No confiar en datos enviados desde cliente.
Actualizar getCurrentUser sin romper los otros proveedores.
```

### Prompt para demos

```txt
Trabaja solo en src/fabrick/demos.
Crea servicios para createDemoToken, validateDemoToken, expireDemo y convertDemoToClient.
Usa hashToken de src/fabrick/security/token.
Registra visitas con writeActivityRecord.
No crear UI todavia.
```
