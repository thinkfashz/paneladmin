# Branding Module

Modulo para manejar identidad visual del sistema y de cada negocio.

## Estado

🟢 Tipos de branding creados.  
🟢 Branding por defecto creado.  
🟢 Servicio `getBrandTheme` creado.  
🟢 Placeholder `updateBrandTheme` creado.  
🟢 Pantalla de carga de 3 segundos creada.  
🟢 Gate reutilizable creado.

## Archivos

- `types.ts`: tipos BrandIdentity, BrandLoadingConfig y BrandTheme.
- `default-brand.ts`: identidad visual por defecto.
- `get-brand-theme.ts`: obtiene el tema activo.
- `update-brand-theme.ts`: prepara actualizacion futura.
- `components/brand-loading-screen.tsx`: pantalla animada con logo y barra.
- `components/brand-loading-gate.tsx`: wrapper para mostrar loading antes del contenido.

## Loading

La pantalla de carga dura por defecto 3000 ms.

Muestra:

- Logo si existe.
- Inicial de la marca si no existe logo.
- Nombre de marca.
- Mensaje.
- Barra de progreso centrada.

## Integracion recomendada

En un layout o pagina privada:

```tsx
import { getBrandTheme } from "@/fabrick/branding/get-brand-theme";
import { BrandLoadingGate } from "@/fabrick/branding/components/brand-loading-gate";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const brand = await getBrandTheme();

  return <BrandLoadingGate brand={brand}>{children}</BrandLoadingGate>;
}
```

## Pendiente

🟡 Conectar con `business_settings`.  
🟡 Crear formulario para editar logo, colores y nombre.  
🟡 Subida real de logo a storage.  
🟡 Vista preview para superadmin.  
🟡 Aplicar tema por negocio.
