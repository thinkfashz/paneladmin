# InsForge Integration

InsForge se usara como proveedor orientado a backend agent-native y modulos futuros de IA/agentes.

## Variables requeridas

```env
INSFORGE_BASE_URL=
INSFORGE_ANON_KEY=
INSFORGE_PROJECT_ID=
```

## Guia Next.js

https://docs.insforge.dev/examples/framework-guides/nextjs

## CLI

No guardes user-api-keys dentro del repositorio.

Usa el login de InsForge desde tu entorno local o desde secretos seguros del entorno de despliegue.

## Uso recomendado en Fabrick Admin

- Automatizaciones futuras.
- Agentes IA.
- Flujos experimentales.
- No usar como base principal inicial hasta validar seguridad, limites y estabilidad.

## Test

La pagina `/superadmin/system/database` revisa si las variables existen y hace una llamada simple a `INSFORGE_BASE_URL` con headers basicos.
