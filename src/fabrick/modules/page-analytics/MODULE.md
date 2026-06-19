# Estadísticas de Páginas

## ID del módulo
`page-analytics`

## Ruta principal
`/admin/page-analytics`

## Estado actual
`base`

## Lógica del módulo
Registrar visitas, clicks, conversiones y actividad de propuestas.

## Descripción
Métricas de páginas generadas.

## Estructura
- `page.tsx`: pantalla principal o wrapper visual del módulo.
- `nav.ts`: configuración de navegación del módulo.
- `types.ts`: tipos propios del módulo.
- `data.ts`: datos demo, constantes o seeds temporales.
- `components/`: componentes visuales internos.
- `actions/`: server actions propias del módulo.
- `services/`: acceso a datos, adaptadores y queries.
- `MODULE.md`: documentación viva de lógica.
- `CHANGELOG.md`: historial de cambios por instrucción.

## Reglas de trabajo
1. No mezclar lógica de este módulo en otro módulo.
2. No modificar auth/setup/db desde aquí salvo que sea estrictamente necesario.
3. Si se cambia una funcionalidad, actualizar este `MODULE.md`.
4. Si se hace un cambio técnico, registrar entrada en `CHANGELOG.md`.
5. Las rutas de `src/app` deben ser wrappers livianos.

## Pendiente
- Conectar datos reales si aplica.
- Separar componentes grandes.
- Crear acciones y servicios propios.
- Crear validaciones.
- Agregar pruebas.
