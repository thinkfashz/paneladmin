# System Control Manual

Este modulo guarda la implementacion pendiente en formato Markdown para evitar bloqueos del conector.

Cuando vayas a activarlo, copia el contenido de cada archivo `.md`, crea el archivo real indicado y pega el codigo.

## Archivos incluidos

1. `01-page-tsx.md`  
   Codigo para la pagina visual.

2. `02-ui-component-tsx.md`  
   Codigo del componente con boton `Ver comandos` visible solo para superadmin.

3. `03-api-route-ts.md`  
   Codigo de API controlada para ejecutar acciones permitidas.

4. `04-access-logs-adapter-ts.md`  
   Codigo para conectar el registro de accesos a la base activa.

5. `05-provider-schema-actions-ts.md`  
   Codigo para preparar creacion de tablas segun proveedor.

## Orden de activacion

1. Crear componente UI.
2. Crear pagina visual.
3. Crear API controlada.
4. Conectar access logs.
5. Conectar creacion real de tablas.
6. Activar permisos solo cuando exista auth superadmin real.

## Regla de seguridad

No activar ejecucion real hasta tener:

- Login real.
- Rol superadmin real.
- Registro de auditoria activo.
- Confirmacion obligatoria para cambios de schema.
- Variables secretas fuera de GitHub.
