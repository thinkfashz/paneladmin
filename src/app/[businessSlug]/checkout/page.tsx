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

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  params: { businessSlug: string };
  searchParams: { total?: string };
};

const paymentMethods = ["Tarjeta de crédito/débito", "Transferencia bancaria", "Mercado Pago"];

export default async function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
  const business = await getBusinessBySlug(params.businessSlug);
  if (!business || business.status === "blocked") notFound();

  const subtotal = Number(searchParams.total ?? 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-muted/20 px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Link href={`/${params.businessSlug}`}>
              <ArrowLeft className="h-4 w-4" />
              Volver a la tienda
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
            {/* Contact info */}
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

            {/* Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Método de pago</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {paymentMethods.map((method, i) => (
                    <div
                      key={method}
                      className={`cursor-pointer rounded-xl border px-3 py-3 text-center text-sm transition-colors hover:border-primary hover:bg-primary/5 ${
                        i === 0 ? "border-primary bg-primary/5 font-medium" : "bg-muted/30"
                      }`}
                    >
                      {method}
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <Label htmlFor="card">Número de tarjeta</Label>
                    <Input id="card" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="expiry">Vencimiento</Label>
                    <Input id="expiry" placeholder="MM/AA" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-base">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (19%)</span>
                    <span>${iva.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="text-green-500">Gratis</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(0)}</span>
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
