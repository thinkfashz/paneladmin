"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const data = [
  {
    date: "Jun 1",
    sessions: 3200,
    bounceRate: 42,
    avgDuration: 185,
    newUsers: 1400,
  },
  {
    date: "Jun 3",
    sessions: 4100,
    bounceRate: 38,
    avgDuration: 210,
    newUsers: 1800,
  },
  {
    date: "Jun 5",
    sessions: 3700,
    bounceRate: 44,
    avgDuration: 195,
    newUsers: 1550,
  },
  {
    date: "Jun 7",
    sessions: 5200,
    bounceRate: 35,
    avgDuration: 240,
    newUsers: 2300,
  },
  {
    date: "Jun 9",
    sessions: 4800,
    bounceRate: 37,
    avgDuration: 228,
    newUsers: 2100,
  },
  {
    date: "Jun 11",
    sessions: 6100,
    bounceRate: 31,
    avgDuration: 265,
    newUsers: 2700,
  },
  {
    date: "Jun 13",
    sessions: 5600,
    bounceRate: 33,
    avgDuration: 250,
    newUsers: 2450,
  },
  {
    date: "Jun 15",
    sessions: 7200,
    bounceRate: 28,
    avgDuration: 290,
    newUsers: 3100,
  },
  {
    date: "Jun 17",
    sessions: 6800,
    bounceRate: 30,
    avgDuration: 275,
    newUsers: 2950,
  },
  {
    date: "Jun 19",
    sessions: 8100,
    bounceRate: 25,
    avgDuration: 310,
    newUsers: 3400,
  },
  {
    date: "Jun 21",
    sessions: 7500,
    bounceRate: 27,
    avgDuration: 298,
    newUsers: 3200,
  },
  {
    date: "Jun 23",
    sessions: 9200,
    bounceRate: 22,
    avgDuration: 335,
    newUsers: 3800,
  },
  {
    date: "Jun 25",
    sessions: 8700,
    bounceRate: 24,
    avgDuration: 320,
    newUsers: 3600,
  },
  {
    date: "Jun 27",
    sessions: 10400,
    bounceRate: 19,
    avgDuration: 360,
    newUsers: 4200,
  },
  {
    date: "Jun 29",
    sessions: 9800,
    bounceRate: 21,
    avgDuration: 345,
    newUsers: 4000,
  },
];

export function TrafficQuality() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic &amp; Quality</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Sessions + New Users area chart */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Sessions &amp; New Users
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke="#6366f1"
                fill="url(#gSessions)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="New Users"
                stroke="#22c55e"
                fill="url(#gNewUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bounce rate + Avg duration area chart */}
        <div>
          <p className="text-muted-foreground mb-2 text-xs font-medium uppercase tracking-wide">
            Bounce Rate (%) &amp; Avg. Session Duration (s)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={data}
              margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gBounce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="bounceRate"
                name="Bounce Rate %"
                stroke="#f59e0b"
                fill="url(#gBounce)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="avgDuration"
                name="Avg Duration (s)"
                stroke="#0ea5e9"
                fill="url(#gDuration)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
