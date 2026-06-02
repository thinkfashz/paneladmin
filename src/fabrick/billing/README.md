# Billing / Wallet Module

Estado: pendiente de implementacion real.

## Objetivo

Crear el modulo de monetizacion de Fabrick Admin: planes, pagos, suscripciones, wallet interno y activacion/bloqueo de clientes.

## Carpeta

```txt
src/fabrick/billing
```

## Archivos esperados

```txt
types.ts
plans.ts
subscriptions.ts
payments.ts
wallet.ts
invoices.ts
activate-business-after-payment.ts
block-business-for-non-payment.ts
get-billing-status.ts
adapters/mercadopago-adapter.ts
adapters/stripe-adapter.ts
README.md
```

## Tablas o colecciones

```txt
plans
subscriptions
payments
invoices
wallet_transactions
billing_events
```

## Estados de suscripcion

```txt
trial
active
past_due
cancelled
blocked
```

## Estados de pago

```txt
pending
approved
rejected
refunded
cancelled
manual_confirmed
```

## Reglas

- No activar cliente hasta registrar conversion o pago manual.
- Todo cambio de plan debe requerir superadmin.
- Todo pago debe registrar activity.
- No guardar secretos de pasarela en GitHub.
- Dejar adaptadores preparados para MercadoPago y Stripe.

## Primer MVP

1. Planes manuales.
2. Pago manual confirmado por superadmin.
3. Activar negocio por fecha de vencimiento.
4. Bloquear negocio si vence.
5. Mostrar estado de cuenta en superadmin.
