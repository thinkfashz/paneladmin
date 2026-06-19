# Landing Builder / Page Engine

## Objetivo
Crear páginas HTML personalizadas, guardarlas en base de datos y compartirlas mediante un link público con token único.

## Ruta admin
`/admin/landing-builder`

## Ruta pública
`/p/[token]`

## Lógica
1. El usuario escribe título, cliente, nicho y HTML.
2. El sistema crea una tabla `generated_pages` si no existe.
3. El sistema guarda el HTML en la base de datos.
4. El sistema genera un token público único.
5. El sistema permite abrir la página pública con `/p/[token]`.

## Estado
MVP funcional.

## Reglas
- Este módulo guarda HTML completo como string.
- La vista pública renderiza el HTML dentro de `iframe srcDoc`.
- No se debe mezclar con CRM todavía.
- Luego se conecta con clientes/prospectos/cotizaciones.
- Cada cambio debe registrarse en CHANGELOG.md.

## Próximas fases
- Editor visual por bloques.
- Selector de plantillas.
- Estadísticas de visitas.
- Estados: borrador, publicado, pausado.
- Conexión con CRM.
- Duplicar páginas.
- Exportar HTML.

## Componentes React avanzados

El Page Engine puede guardar código de componentes avanzados como texto, pero no debe ejecutar imports arbitrarios dentro del admin principal.

Para componentes con dependencias como `cobe`, la estrategia segura es:

1. Instalar dependencia en el proyecto.
2. Crear componente interno revisado.
3. Renderizarlo en una ruta segura.
4. Guardar el código fuente como referencia editable.
5. En una fase futura, compilar código arbitrario usando Vite Builder/Sandbox.

Ruta de prueba:
`/admin/landing-builder/globe-demo`
