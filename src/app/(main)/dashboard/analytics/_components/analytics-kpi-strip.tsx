import { Activity, Clock, MousePointerClick, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const kpis = [
  {
    title: "Total Sessions",
    value: "94,820",
    change: "+18.4%",
    trend: "up",
    icon: Activity,
    desc: "vs. last 30 days",
  },
  {
    title: "Unique Visitors",
    value: "61,340",
    change: "+12.1%",
    trend: "up",
    icon: Users,
    desc: "vs. last 30 days",
  },
  {
    title: "Avg. Session Duration",
    value: "4m 22s",
    change: "+0:38",
    trend: "up",
    icon: Clock,
    desc: "vs. last 30 days",
  },
  {
    title: "Bounce Rate",
    value: "29.6%",
    change: "-4.2%",
    trend: "down-good",
    icon: MousePointerClick,
    desc: "vs. last 30 days",
  },
];

export function AnalyticsKpiStrip() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        const isPositive = kpi.trend === "up" || kpi.trend === "down-good";
        return (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-1">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {kpi.title}
              </CardTitle>
              <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-3xl font-bold">{kpi.value}</div>
              <div className="mt-1 flex items-center gap-1">
                <Badge variant={isPositive ? "default" : "destructive"}>
                  {kpi.change}
                </Badge>
                <span className="text-muted-foreground text-xs">{kpi.desc}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
