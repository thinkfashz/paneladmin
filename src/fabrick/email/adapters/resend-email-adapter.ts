import type { SendEmailInput, SendEmailResult } from "../types";

export async function sendEmailViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"; // Default Resend test email
  const replyTo = process.env.RESEND_REPLY_TO;

  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY no configurada." };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [input.to],
        subject: input.subject,
        html: input.html,
        reply_to: replyTo || undefined,
        tags: [{ name: "business_id", value: input.businessId ?? "none" }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.message || "Error al enviar correo por Resend." };
    }

    return { ok: true, messageId: data.id };
  } catch (err) {
    console.error("Excepción en sendEmailViaResend:", err);
    return { ok: false, error: "Error desconocido intentando enviar el correo." };
  }
}
