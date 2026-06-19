import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function InvoiceModulePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
      <section className="rounded-2xl border bg-background p-5 shadow-sm">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Módulo Fabrick · pages
        </p>
        <h1 className="mt-2 font-bold text-2xl tracking-tight md:text-3xl">
          Invoice
        </h1>
        <p className="mt-2 max-w-3xl text-muted-foreground text-sm">
          Módulo de facturas.
        </p>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Base modular activa</CardTitle>
              <CardDescription>
                Esta pantalla ya existe para que puedas avanzar el módulo sin romper la app.
              </CardDescription>
            </div>
            <Badge variant="outline">coming-soon</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">
            Lógica esperada: Facturas, boletas, documentos tributarios y estados de pago.
          </p>
          <p className="text-muted-foreground text-sm">
            Próximo paso: completar componentes, acciones, servicios y conexión de datos dentro de
            <code className="mx-1 rounded bg-muted px-1 py-0.5">src/fabrick/modules/invoice</code>.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
