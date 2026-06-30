import { NextResponse } from "next/server";

import { probeMercadoPago } from "@/lib/mercadopago";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const status = await probeMercadoPago();
  return NextResponse.json(
    {
      status: status.status,
      reachable: status.reachable,
      latencyMs: status.latencyMs,
      mode: status.mode,
      message: status.message,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
