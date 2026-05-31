import { AnalyticsKpiStrip } from "./_components/analytics-kpi-strip";
import { AnalyticsToolbar } from "./_components/analytics-toolbar";
import { RealtimeVisitors } from "./_components/realtime-visitors";
import { TopPages } from "./_components/top-pages";
import { TopTrafficSources } from "./_components/top-traffic-sources";
import { TrafficQuality } from "./_components/traffic-quality";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Track your site performance and audience behaviour.
        </p>
      </div>

      <AnalyticsToolbar />
      <AnalyticsKpiStrip />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficQuality />
        </div>
        <RealtimeVisitors />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <TopTrafficSources />
        <TopPages />
      </div>
    </div>
  );
}
