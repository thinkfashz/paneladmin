# 03 - Plan de handler controlado

## Archivo destino sugerido

`src/app/api/private-zone/system-control/route.ts`

## Funcion

Este archivo debe recibir solicitudes del panel visual y ejecutar solo acciones permitidas.

## Reglas

1. No aceptar comandos libres.
2. No aceptar SQL libre.
3. No leer archivos arbitrarios.
4. Validar rol en servidor.
5. Registrar cada intento.
6. Aplicar rate limit.
7. Pedir confirmacion para crear tablas.

## Entradas permitidas

- actionId
- confirmationText

## Salidas esperadas

- ok
- message
- provider
- result

## Lista permitida

- system.health
- db.status
- db.create_core_tables
- db.create_access_logs
- db.list_tables
- app.files_overview
- app.module_map

## Implementacion pendiente

Crear el codigo real manualmente copiando la logica desde:

- src/fabrick/system-control/items.ts
- src/fabrick/system-control/provider.ts
- src/fabrick/system-control/actions.ts cuando exista
