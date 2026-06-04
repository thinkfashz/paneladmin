export type EmailMessageStatus = "queued" | "sent" | "failed" | "opened" | "clicked";

export type EmailMessage = {
  id: string;
  business_id?: string | null;
  customer_id?: string | null;
  quote_id?: string | null;
  appointment_id?: string | null;
  to_email: string;
  subject: string;
  body_html: string;
  status: EmailMessageStatus;
  provider_id?: string | null; // e.g. Resend message ID
  error_message?: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailEvent = {
  id: string;
  email_message_id: string;
  event_type: EmailMessageStatus;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  businessId?: string | null;
  customerId?: string | null;
  quoteId?: string | null;
  appointmentId?: string | null;
};

export type SendEmailResult = {
  ok: boolean;
  messageId?: string;
  error?: string;
};
