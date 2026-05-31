import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const sources = [
  { name: "Organic Search", sessions: 38400, pct: 100, color: "bg-indigo-500" },
  { name: "Direct", sessions: 22100, pct: 58, color: "bg-green-500" },
  { name: "Referral", sessions: 14800, pct: 39, color: "bg-amber-500" },
  { name: "Social", sessions: 11200, pct: 29, color: "bg-sky-500" },
  { name: "Email", sessions: 6300, pct: 16, color: "bg-rose-500" },
  { name: "Paid Search", sessions: 2020, pct: 5, color: "bg-violet-400" },
];

export function TopTrafficSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Traffic Sources</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sources.map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{s.name}</span>
              <span className="text-muted-foreground">
                {s.sessions.toLocaleString()}
              </span>
            </div>
            <Progress value={s.pct} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
