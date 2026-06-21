import Link from "next/link";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SidebarSupportCard() {
  return (
    <Card size="sm" className="shadow-none group-data-[collapsible=icon]:hidden omnifix-glow-card">
      <CardHeader className="px-4">
        <CardTitle className="text-sm">Módulos Omnifix activos</CardTitle>
        <CardDescription>
          Admin, CRM, Page Engine y E-commerce corren sobre la estructura original del dashboard. Revisa el hub en&nbsp;
          <Link href="/admin" className="font-medium text-foreground underline-offset-4 hover:underline">
            /admin
          </Link>
          .
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
