import { NextResponse } from "next/server";

import { calculateCheckoutSummary, validateCheckoutPayload, type CheckoutPayload } from "@/lib/checkout";
import { createMercadoPagoPreference, getAppBaseUrl } from "@/lib/mercadopago";
import { upsertOmnifixOrder } from "@/lib/omnifixOrders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function orderId(prefix = "OMN") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const validationErrors = validateCheckoutPayload(body);
    if (validationErrors.length > 0) return NextResponse.json({ error: "Datos inválidos para checkout.", validationErrors }, { status: 422 });

    const resumen = calculateCheckoutSummary(body.items, body.region);
    const id = body.clientOrderKey?.trim() || orderId();
    const createdAt = new Date().toISOString();
    const trackingUrl = `${getAppBaseUrl()}/checkout?order=${encodeURIComponent(id)}`;

    const orden = upsertOmnifixOrder({
      id,
      cliente: body.cliente,
      items: body.items,
      resumen,
      region: body.region,
      shippingAddress: body.shippingAddress ?? "",
      estado: "pendiente_pago",
      paymentMethod: "mercadopago",
      paymentProvider: "mercado_pago",
      trackingUrl,
      creadoEn: createdAt,
      actualizadoEn: createdAt,
    });

    const preference = await createMercadoPagoPreference({ orderId: orden.id, payload: { ...body, paymentMethod: "mercadopago" }, summary: resumen });
    const checkoutUrl = preference.init_point || preference.sandbox_init_point || null;
    upsertOmnifixOrder({ ...orden, preferenceId: preference.id, checkoutUrl });

    return NextResponse.json(
      {
        data: { ...orden, preferenceId: preference.id, checkoutUrl },
        payment: { provider: "mercado_pago", preferenceId: preference.id, checkoutUrl },
        notification: { ok: true, deferred: true, reason: "El correo y la boleta final se validan cuando Mercado Pago confirma el pago." },
      },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno al procesar el checkout.";
    return NextResponse.json({ error: message }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
