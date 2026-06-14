import { notFound } from "next/navigation";

import Link from "next/link";

import { ArrowLeft, Lock, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MotorSatelital } from "@/fabrick/store/checkout/motor-satelital";
import { getBusinessBySlug } from "@/fabrick/superadmin/services/business-service";

import { PaymentSelector } from "./_components/payment-selector";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: { businessSlug: string };
  searchParams: { total?: string };
};

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const business = await getBusinessBySlug(params.businessSlug);
  if (!business || business.status === "blocked") notFound();

  const subtotal = Number(searchParams.total ?? 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-muted/20 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Link href={`/${params.businessSlug}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="font-semibold capitalize">{business.name}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <h1 className="mb-8 font-bold text-3xl tracking-tight">Finalizar Compra</h1>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Datos de contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input id="nombre" placeholder="Tu nombre" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@correo.cl" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="tel" placeholder="+56 9 XXXX XXXX" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rut">RUT (opcional)</Label>
                  <Input id="rut" placeholder="12.345.678-9" />
                </div>
              </CardContent>
            </Card>

            {/* Motor Satelital */}
            <MotorSatelital />

            {/* Pago */}
            <PaymentSelector />
          </div>

          {/* Resumen */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toLocaleString("es-CL")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (19%)</span>
                    <span>${iva.toLocaleString("es-CL")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-500">Gratis</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toLocaleString("es-CL")}</span>
                </div>
                <Button className="w-full" size="lg">
                  Confirmar pedido
                </Button>
                <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs">
                  <Lock className="h-3 w-3" />
                  Pago 100% seguro y encriptado
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
