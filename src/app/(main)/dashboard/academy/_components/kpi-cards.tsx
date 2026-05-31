import { ArrowUp, Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const kpis = [
  {
    title: "Students Enrolled",
    value: "1,284",
    change: "+12%",
    trend: "up",
    info: "Total active enrollments this semester",
    footer: "View all students",
  },
  {
    title: "Avg. Completion Rate",
    value: "74%",
    change: "+3%",
    trend: "up",
    info: "Average course completion across all programs",
    footer: "View completion report",
  },
  {
    title: "Upcoming Assignments",
    value: "38",
    change: "-5",
    trend: "down",
    info: "Assignments due in the next 7 days",
    footer: "View assignments",
  },
  {
    title: "Live Sessions Today",
    value: "6",
    change: "+2",
    trend: "up",
    info: "Scheduled live classes for today",
    footer: "View schedule",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {kpi.title}
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground h-4 w-4 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent>{kpi.info}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-3xl font-bold">{kpi.value}</div>
            <Badge
              variant={kpi.trend === "up" ? "default" : "secondary"}
              className="mt-1 gap-1"
            >
              <ArrowUp
                className={`h-3 w-3 ${kpi.trend === "down" ? "rotate-180" : ""}`}
              />
              {kpi.change}
            </Badge>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="h-auto p-0 text-xs">
              {kpi.footer}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
