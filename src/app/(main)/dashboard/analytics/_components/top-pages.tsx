import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const pages = [
  { path: "/home", views: 18420, pct: 100 },
  { path: "/pricing", views: 9310, pct: 51 },
  { path: "/docs/getting-started", views: 7840, pct: 43 },
  { path: "/blog/release-v2", views: 5120, pct: 28 },
  { path: "/dashboard", views: 4390, pct: 24 },
  { path: "/contact", views: 2870, pct: 16 },
];

export function TopPages() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Pages</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          <ExternalLink className="h-3.5 w-3.5" /> Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {pages.map((p) => (
          <div key={p.path} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-mono">{p.path}</span>
              <span className="font-medium">{p.views.toLocaleString()}</span>
            </div>
            <Progress value={p.pct} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
