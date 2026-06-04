import { sendEmailViaResend } from "./adapters/resend-email-adapter";
import type { SendEmailInput, SendEmailResult } from "./types";
// import { writeEmailActivityToDb } from "./... (Futuro historial)"

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const result = await sendEmailViaResend(input);

  // TODO: Registrar en BD (email_messages / email_events) aquí una vez definido el adaptador.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[Email] Envio de correo a ${input.to} result:`, result);
  }

  return result;
}
