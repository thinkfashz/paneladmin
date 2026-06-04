import { Badge } from "@/components/ui/badge";

import type { Customer } from "../types";

type CustomerTableProps = {
  customers: Customer[];
};

export function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-8 text-center">
        <h3 className="font-semibold text-lg">Sin clientes</h3>
        <p className="mt-1 text-muted-foreground text-sm">No tienes clientes registrados aún.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="p-4 font-medium">Nombre</th>
            <th className="p-4 font-medium">Contacto</th>
            <th className="p-4 font-medium">Estado</th>
            <th className="p-4 font-medium">Última Visita</th>
            <th className="p-4 font-medium">Tags</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-background">
          {customers.map((customer) => (
            <tr key={customer.id} className="transition-colors hover:bg-muted/20">
              <td className="p-4 font-medium text-foreground">{customer.name}</td>
              <td className="p-4 text-muted-foreground">
                <div className="flex flex-col">
                  {customer.email ? <span>{customer.email}</span> : null}
                  {customer.phone ? <span>{customer.phone}</span> : null}
                </div>
              </td>
              <td className="p-4">
                <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
              </td>
              <td className="p-4 text-muted-foreground">
                {customer.last_visit_at ? new Date(customer.last_visit_at).toLocaleDateString() : "-"}
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-1">
                  {customer.tags?.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
