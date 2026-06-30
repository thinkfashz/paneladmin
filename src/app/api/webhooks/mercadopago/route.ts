import { NextResponse } from "next/server";

import { getMercadoPagoPayment, mapMercadoPagoStatus } from "@/lib/mercadopago";
import { updateOmnifixOrderPayment } from "@/lib/omnifixOrders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = (await request.json().catch(() => ({}))) as { data?: { id?: string }; type?: string; action?: string };
    const dataId = body?.data?.id || url.searchParams.get("data.id") || url.searchParams.get("id");

    if (!dataId) return NextResponse.json({ ok: true, skipped: "missing_payment_id" });

    const payment = await getMercadoPagoPayment(String(dataId));
    const orderId = payment.external_reference;
    if (orderId) {
      updateOmnifixOrderPayment(orderId, {
        estado: mapMercadoPagoStatus(payment.status),
        paymentId: String(payment.id),
      });
    }

    return NextResponse.json({ ok: true, paymentId: payment.id, orderId, status: payment.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "mercadopago_webhook_error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, provider: "mercado_pago", service: "omnifix-webhook" });
}
