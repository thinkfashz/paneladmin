# PocketBase Integration

PocketBase se usara como proveedor secundario para demos locales, pruebas rapidas o instalaciones simples.

## Variables requeridas

```env
POCKETBASE_URL=http://127.0.0.1:8090
POCKETBASE_ADMIN_EMAIL=
POCKETBASE_ADMIN_PASSWORD=
```

## Produccion

Revisa la guia oficial:

https://pocketbase.io/docs/going-to-production/

## Uso recomendado en Fabrick Admin

- Prototipos rapidos.
- Demos locales.
- Clientes pequenos con una instalacion simple.
- No usar como base principal del SaaS multi-cliente inicial.

## Test

La pagina `/superadmin/system/database` prueba `POCKETBASE_URL/api/health`.
