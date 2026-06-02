# Email Module - Resend

Estado: pendiente de implementacion real.

## Objetivo

Crear un modulo real para enviar correos desde Fabrick Admin usando Resend.

## Carpeta

```txt
src/fabrick/email
```

## Variables necesarias

```txt
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_REPLY_TO=
```

## Archivos esperados

```txt
types.ts
provider.ts
send-email.ts
send-demo-invite-email.ts
send-welcome-email.ts
send-appointment-confirmation.ts
send-quote-email.ts
get-email-history.ts
templates/demo-invite.ts
templates/welcome.ts
templates/appointment-confirmation.ts
templates/quote.ts
adapters/resend-email-adapter.ts
README.md
```

## Tablas o colecciones

```txt
email_messages
email_events
email_templates
```

## Reglas

- No guardar `RESEND_API_KEY` en GitHub.
- Todo envio debe registrar activity.
- Todo envio debe guardar historial.
- Si falla, guardar error.
- Los correos deben poder asociarse a `business_id`, `customer_id`, `quote_id` o `appointment_id`.

## Eventos sugeridos

```txt
email_queued
email_sent
email_failed
email_opened
email_clicked
```

## Prioridad

1. Crear tipos.
2. Crear adaptador Resend.
3. Crear sendEmail base.
4. Crear historial.
5. Crear templates.
6. Conectar demo invite.
7. Conectar citas y presupuestos.
