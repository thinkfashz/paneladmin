# CHANGELOG — Landing Builder

## MVP Page Engine

- Se creó tabla `generated_pages`.
- Se agregó formulario para guardar HTML real.
- Se agregó token público.
- Se agregó ruta pública `/p/[token]`.
- Se agregó preview público con iframe.

## Importador HTML + preview móvil

- Se añadió botón `Importar HTML`.
- Se permite cargar archivos `.html` o `.htm`.
- El contenido importado se inserta automáticamente en el editor.
- Se añadió preview en vivo dentro de un marco móvil tipo iPhone.
- El preview usa `iframe srcDoc` para mostrar el HTML antes de guardarlo.
