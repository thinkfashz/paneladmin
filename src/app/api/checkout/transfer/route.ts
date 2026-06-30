import { NextResponse } from "next/server";

import { calculateCheckoutSummary, validateCheckoutPayload, type CheckoutPayload } from "@/lib/checkout";
import { upsertOmnifixOrder } from "@/lib/omnifixOrders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutPayload;
    const validationErrors = validateCheckoutPayload(body);
    if (validationErrors.length) return NextResponse.json({ error: "Datos inválidos.", validationErrors }, { status: 422 });

    const resumen = calculateCheckoutSummary(body.items, body.region);
    const id = body.clientOrderKey?.trim() || `OMN-MANUAL-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const orden = upsertOmnifixOrder({
      id,
      cliente: body.cliente,
      items: body.items,
      resumen,
      region: body.region,
      shippingAddress: body.shippingAddress ?? "",
      estado: "pendiente_transferencia",
      paymentMethod: "transfer",
      paymentProvider: "transferencia",
      creadoEn: now,
      actualizadoEn: now,
    });

    return NextResponse.json({ data: orden, payment: { checkoutUrl: null, preferenceId: null, provider: "manual" }, notification: { ok: true, deferred: true, reason: "Orden pendiente de validación manual." } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
