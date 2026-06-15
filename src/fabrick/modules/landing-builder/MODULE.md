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
