# Security Module - Fabrick Admin

Este modulo contiene las capas de seguridad base del sistema.

## Capas implementadas

### 1. Tokens seguros
Archivo: `token.ts`

- Tokens aleatorios con `crypto.randomBytes`.
- Hash HMAC SHA-256 usando `DEMO_TOKEN_SECRET`.
- Expiracion configurable por horas.
- Nunca guardar token plano en base de datos.

### 2. Hash y comparacion segura
Archivo: `hash.ts`

- SHA-256 para datos no sensibles.
- HMAC SHA-256 para tokens.
- Comparacion segura con `timingSafeEqual`.
- Enmascarado de secretos para UI/logs.

### 3. Validacion real de demo
Archivo: `validate-demo-access.ts`

Valida:

- Slug presente.
- Token presente.
- Hash de token.
- Relacion token-negocio.
- Token activo.
- Fecha de expiracion.
- Estado del negocio.
- Limite de visitas.

### 4. Rate limit
Archivo: `rate-limit.ts`

Incluye limites para:

- Acceso a demos.
- Intentos de login.
- Tests de token/conexion.

La version inicial usa memoria del servidor. Para produccion avanzada se debe mover a Redis, Upstash o proveedor persistente.

### 5. Auditoria
Archivo: `audit-log.ts`

Permite registrar:

- demo_opened
- demo_denied
- admin_opened
- login_attempt
- rate_limited
- token_created
- token_expired
- security_warning

No guarda IP plana: genera `ip_hash`.

## Capas pendientes para produccion

- Conectar middleware global.
- Guardar auditoria en InsForge/Supabase.
- Crear API route protegida para validar demos.
- Activar headers de seguridad.
- Endurecer CORS.
- Configurar secrets en plataforma de deploy.
- Revisar permisos de base por `business_id`.

## Reglas criticas

- No guardar claves secretas en GitHub.
- No exponer service role keys en cliente.
- No confiar en contador visual de 72h.
- Toda expiracion se valida en servidor.
- Todo acceso demo se valida por token + hash + estado + expiracion.
