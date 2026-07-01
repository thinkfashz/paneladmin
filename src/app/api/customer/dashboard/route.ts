import { NextResponse } from "next/server";

import { addCustomerComment, addCustomerLike, addSupportMessage, getCustomerDashboard } from "@/lib/omnifixCustomerStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "cliente@omnifix.local";
  return NextResponse.json(getCustomerDashboard(email), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string; action?: string; productId?: string; productName?: string; text?: string };
  const email = body.email || "cliente@omnifix.local";
  if (body.action === "like") addCustomerLike(email, { id: body.productId || "servicio", name: body.productName || "Servicio Omnifix" });
  if (body.action === "comment") addCustomerComment(email, { productId: body.productId || "servicio", productName: body.productName || "Servicio Omnifix", text: body.text || "Comentario" });
  if (body.action === "support") addSupportMessage(email, body.text || "Necesito ayuda con mi pedido.");
  return NextResponse.json(getCustomerDashboard(email), { headers: { "Cache-Control": "no-store" } });
}
