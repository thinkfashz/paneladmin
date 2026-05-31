"use client";

import { useEffect, useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEVICE_COLORS = ["#6366f1", "#22c55e", "#f59e0b"];

const deviceData = [
  { name: "Desktop", value: 58 },
  { name: "Mobile", value: 32 },
  { name: "Tablet", value: 10 },
];

const countries = [
  { flag: "🇺🇸", name: "United States", pct: 34 },
  { flag: "🇬🇧", name: "United Kingdom", pct: 14 },
  { flag: "🇩🇪", name: "Germany", pct: 11 },
  { flag: "🇫🇷", name: "France", pct: 9 },
  { flag: "🇨🇦", name: "Canada", pct: 7 },
];

export function RealtimeVisitors() {
  const [count, setCount] = useState(247);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 5) - 2);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
          </span>
          Realtime Visitors
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-6">
        {/* Live counter */}
        <div className="text-center">
          <p className="text-5xl font-bold tabular-nums">{count}</p>
          <p className="text-muted-foreground mt-1 text-sm">active right now</p>
        </div>

        {/* Device breakdown donut */}
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            By Device
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {deviceData.map((_, i) => (
                  <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
                formatter={(v: number) => [`${v}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-1 flex justify-center gap-4">
            {deviceData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1 text-xs">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: DEVICE_COLORS[i] }}
                />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </div>

        {/* Top countries */}
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Top Countries
          </p>
          <div className="space-y-1.5">
            {countries.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-sm">
                <span>{c.flag}</span>
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-muted-foreground font-mono text-xs">
                  {c.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
