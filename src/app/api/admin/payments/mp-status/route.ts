import { NextResponse } from "next/server";

import { requireBusinessUserAuth } from "@/fabrick/auth/require-business-user";
import { fetchMercadoPagoAccount, getMercadoPagoAccessToken, probeMercadoPago } from "@/lib/mercadopago";
import { listOmnifixOrders } from "@/lib/omnifixOrders";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const auth = await requireBusinessUserAuth();
  if (!auth.allowed) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const probe = await probeMercadoPago();
  const token = getMercadoPagoAccessToken();
  const account = token ? await fetchMercadoPagoAccount(token) : null;
  const recentOrders = listOmnifixOrders(30);
  const kpis = recentOrders.reduce(
    (acc, order) => {
      if (order.estado === "pagada") {
        acc.approved += 1;
        acc.volume += order.resumen.total;
      } else if (order.estado === "fallida") acc.rejected += 1;
      else acc.pending += 1;
      return acc;
    },
    { approved: 0, pending: 0, rejected: 0, volume: 0, currency: "CLP" as const },
  );

  return NextResponse.json(
    {
      ...probe,
      account,
      verifiedMode: account?.isTestUser ? "sandbox" : probe.mode,
      kpis,
      recentOrders,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
