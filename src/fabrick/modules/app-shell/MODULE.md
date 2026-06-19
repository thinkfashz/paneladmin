# App Shell Global

## Lógica del módulo

El App Shell Global arropa toda la interfaz de la aplicación sin mezclar lógica de negocio.

## Qué debe contener

- Layout admin
- Layout e-commerce
- Layout público
- Layout auth
- Layout setup
- Sidebar global
- Branding global
- Estado de conexión
- Providers visuales

## Qué NO debe contener

- Lógica F29
- Lógica CRM
- Lógica de cotizaciones
- Lógica de clientes
- Queries específicas de módulos de negocio

## Estructura propuesta

- `layouts/`
- `navigation/`
- `branding/`
- `status/`
- `providers/`
- `admin-shell/`
- `ecommerce-shell/`
- `public-site-shell/`
- `auth-shell/`
- `setup-shell/`

## Regla

Si algo afecta a toda la app, va aquí.
Si afecta a un negocio específico, va al módulo correspondiente.
