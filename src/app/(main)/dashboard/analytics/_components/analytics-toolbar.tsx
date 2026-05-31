"use client";

import { CalendarDays } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const RANGES = ["7d", "30d", "90d", "12m"] as const;
type Range = (typeof RANGES)[number];

export function AnalyticsToolbar() {
  const [range, setRange] = useState<Range>("30d");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1 rounded-lg border p-1">
        {RANGES.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={range === r ? "default" : "ghost"}
            onClick={() => setRange(r)}
            className="h-7 px-3 text-xs"
          >
            {r}
          </Button>
        ))}
      </div>
      <Button variant="outline" size="sm" className="gap-2 text-xs">
        <CalendarDays className="h-3.5 w-3.5" />
        Custom range
      </Button>
    </div>
  );
}
