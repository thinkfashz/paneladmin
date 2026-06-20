import { getDashboardMetrics } from "@/fabrick/modules/dashboard/services/dashboard-metrics-service";

import { MetricCards } from "./_components/metric-cards";
import { PerformanceOverview } from "./_components/performance-overview";
import { SubscriberOverview } from "./_components/subscriber-overview";

export const dynamic = "force-dynamic";

export default async function Page() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="rounded-xl border bg-card/60 px-4 py-3 text-sm text-muted-foreground shadow-xs">
        <span className="font-medium text-foreground">Estado de datos:</span> {metrics.status.message}
      </div>
      <MetricCards metrics={metrics} />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}
