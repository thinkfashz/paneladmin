# CHANGELOG — Contabilidad F29 / SII

## Base modular creada

- Se creó carpeta modular `accounting-f29`.
- Se añadió `MODULE.md`.
- Se añadió `nav.ts`.
- Se añadió `types.ts`.
- Se añadió `data.ts`.
- Se añadió estructura `components/`, `actions/`, `services/`.

### Lógica inicial
Ayudar a calcular y preparar información tributaria chilena para F29.

### Próximo paso
Terminar la funcionalidad real del módulo en un PR dedicado.
\n## Migración desde ruta existente\n\n- Se migró la página desde `src/app/admin/contabilidad` hacia `src/fabrick/modules/accounting-f29/page.tsx`.\n\n- Se migraron componentes desde `src/app/admin/contabilidad/_components` hacia `src/fabrick/modules/accounting-f29/components`.\n