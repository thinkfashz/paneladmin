"use client";

import { useState } from "react";
import { CreditCard, Building2, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const METHODS = [
  { id: "card", label: "Tarjeta", icon: CreditCard },
  { id: "transfer", label: "Transferencia", icon: Building2 },
  { id: "mercadopago", label: "Mercado Pago", icon: Smartphone },
];

export function PaymentSelector() {
  const [selected, setSelected] = useState("card");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Método de pago</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2 sm:grid-cols-3">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelected(id)}
              className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors",
                selected === id
                  ? "border-primary bg-primary/5 font-medium text-primary"
                  : "bg-muted/30 hover:border-primary/40",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>

        {selected === "card" && (
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
        )}

        {selected === "transfer" && (
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-sm">
            <p className="font-semibold text-blue-700 dark:text-blue-400">Datos para transferencia</p>
            <div className="mt-2 space-y-1 text-muted-foreground">
              <p>Banco: Banco de Chile</p>
              <p>Cuenta corriente: 000-123456-01</p>
              <p>RUT: 76.543.210-K</p>
              <p>Email: pagos@mitienda.cl</p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Enviar comprobante al email indicado. Tu pedido será procesado en 1-2 hábiles.
            </p>
          </div>
        )}

        {selected === "mercadopago" && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
            <p className="font-semibold text-amber-700 dark:text-amber-400">Pagar con Mercado Pago</p>
            <p className="mt-1 text-muted-foreground">
              Serás redirigido a Mercado Pago para completar el pago de forma segura.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
