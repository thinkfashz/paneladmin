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

## ContainerScroll para visor HTML

- Se añadió `components/container-scroll.tsx`.
- Se instaló `framer-motion`.
- Se reemplazó el visor móvil estático por un visor animado con scroll y perspectiva.
- El HTML importado o editado se muestra dentro del nuevo visor.

## Botones premium

- Se actualizó el componente global `Button`.
- Se añadieron `LiquidButton` y `MetalButton`.
- Se aplicó `MetalButton` al importador HTML y al botón de guardar del Page Engine.

## Fix dependencia Slot

- Se añadió `@radix-ui/react-slot` porque el componente global `Button` usa `Slot` para soportar `asChild`.

## Fix compatibilidad Button size

- Se añadieron tamaños `xs`, `xl`, `icon-xs`, `icon-sm` e `icon-lg`.
- Esto mantiene compatibilidad con componentes existentes del dashboard original.

## React Demo compartible

- Se añadió modo `React Demo`.
- Se permite pegar código React tipo `function App()`.
- Se permite importar `.jsx`, `.tsx` o `.js`.
- El sistema genera un HTML ejecutable con React, ReactDOM, Babel y Tailwind desde CDN.
- Se guarda el código React y CSS en `generated_pages`.
- El link público `/p/[token]` puede mostrar demos React aisladas en iframe.
