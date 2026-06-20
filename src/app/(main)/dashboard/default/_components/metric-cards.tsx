import { DollarSign, TrendingDown, TrendingUp, UserPlus, Users, Waves } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetricValue, DashboardMetrics } from "@/fabrick/modules/dashboard/services/dashboard-metrics-service";

function TrendBadge({ metric }: { metric: DashboardMetricValue }) {
  const Icon = metric.trendDirection === "down" ? TrendingDown : TrendingUp;
  const variant = metric.trendDirection === "down" ? "destructive" : "default";

  return (
    <Badge variant={variant}>
      <Icon className="size-3" />
      {metric.trendLabel}
    </Badge>
  );
}

function DataStatus({ source }: { source: DashboardMetricValue["source"] }) {
  if (source === "live") {
    return <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Live</span>;
  }

  if (source === "empty") {
    return <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">Sin datos</span>;
  }

  return <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">Config</span>;
}

function MetricCard({
  title,
  metric,
  icon: Icon,
}: {
  title: string;
  metric: DashboardMetricValue;
  icon: typeof DollarSign;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
            <Icon className="size-4" />
          </div>
          <DataStatus source={metric.source} />
        </CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">{metric.formatted}</div>
          <TrendBadge metric={metric} />
        </div>
        <p className="text-muted-foreground text-sm">{metric.description}</p>
      </CardContent>
    </Card>
  );
}

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs xl:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricCard title="Ingresos reales" metric={metrics.totalRevenue} icon={DollarSign} />
      <MetricCard title="Nuevos clientes" metric={metrics.newCustomers} icon={UserPlus} />
      <MetricCard title="Cuentas activas" metric={metrics.activeAccounts} icon={Users} />
      <MetricCard title="Crecimiento" metric={metrics.growthRate} icon={Waves} />
    </div>
  );
}
