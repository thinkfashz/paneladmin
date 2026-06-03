import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Business } from "../types";

type BusinessListProps = {
  businesses: Business[];
};

export function BusinessList({ businesses }: BusinessListProps) {
  if (businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-muted/20 p-8 text-center">
        <h3 className="font-semibold text-lg">Sin negocios</h3>
        <p className="mt-1 text-muted-foreground text-sm">
          No hay negocios registrados actualmente en la base de datos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => (
        <Card key={business.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="truncate">{business.name}</CardTitle>
                <CardDescription className="mt-1 truncate font-mono text-xs">/{business.slug}</CardDescription>
              </div>
              <Badge variant={business.status === "active" ? "default" : "secondary"}>{business.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-muted-foreground text-sm">
              <div className="flex justify-between">
                <span>Tipo:</span>
                <span className="font-medium text-foreground capitalize">{business.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Creado:</span>
                <span className="text-foreground">{new Date(business.created_at).toLocaleDateString()}</span>
              </div>
              {business.status === "demo" && business.demo_expires_at && (
                <div className="flex justify-between">
                  <span>Demo expira:</span>
                  <span className="font-medium text-orange-500">
                    {new Date(business.demo_expires_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
